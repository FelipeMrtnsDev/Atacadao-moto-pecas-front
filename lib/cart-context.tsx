"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { CartItem, Product } from "./types"

interface CartContextType {
  items: CartItem[]
  addToCart: (
    product: Product,
    quantity: number,
    options?: { selectedSize?: string; selectedColor?: string; selectedHeight?: string },
  ) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("moto-shop-cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (error) {
        console.error("Failed to load cart:", error)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("moto-shop-cart", JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToCart = (
    product: Product,
    quantity: number,
    options?: { selectedSize?: string; selectedColor?: string; selectedHeight?: string },
  ) => {
    setItems((currentItems) => {
      // Check if item with same product and options already exists
      const existingItemIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === options?.selectedSize &&
          item.selectedColor === options?.selectedColor &&
          item.selectedHeight === options?.selectedHeight,
      )

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const newItems = [...currentItems]
        newItems[existingItemIndex].quantity += quantity
        return newItems
      } else {
        // Add new item
        return [
          ...currentItems,
          {
            product,
            quantity,
            selectedSize: options?.selectedSize,
            selectedColor: options?.selectedColor,
            selectedHeight: options?.selectedHeight,
          },
        ]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
