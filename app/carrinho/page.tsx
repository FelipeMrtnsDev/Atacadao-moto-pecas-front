"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/lib/cart-context"

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart()

  const subtotal = getCartTotal()
  const shipping = subtotal > 299 ? 0 : 29.9
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Sidebar />

        <main className="lg:pl-72">
          <header className="sticky top-0 z-40 bg-background border-b border-border">
            <div className="container mx-auto px-4 py-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Voltar para a loja
              </Link>
            </div>
          </header>

          <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">Seu carrinho está vazio</h1>
                <p className="text-muted-foreground">Adicione produtos ao carrinho para continuar comprando.</p>
              </div>
              <Link href="/">
                <Button size="lg">Continuar Comprando</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="lg:pl-72">
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para a loja
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Carrinho de Compras</h1>
            <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
              Limpar Carrinho
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <Link href={`/produto/${item.product.id}`} className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/produto/${item.product.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                            {item.product.name}
                          </h3>
                        </Link>

                        <div className="mt-2 space-y-1">
                          {item.selectedSize && (
                            <p className="text-sm text-muted-foreground">Tamanho: {item.selectedSize}</p>
                          )}
                          {item.selectedColor && (
                            <p className="text-sm text-muted-foreground">Cor: {item.selectedColor}</p>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 bg-transparent"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              R$ {item.product.price.toFixed(2).replace(".", ",")} cada
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Resumo do Pedido</h2>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-semibold">R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Frete</span>
                      <span className="font-semibold">
                        {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2).replace(".", ",")}`}
                      </span>
                    </div>
                    {subtotal < 299 && (
                      <p className="text-xs text-muted-foreground">
                        Falta R$ {(299 - subtotal).toFixed(2).replace(".", ",")} para frete grátis
                      </p>
                    )}
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Em até 12x de R$ {(total / 12).toFixed(2).replace(".", ",")} sem juros
                  </p>

                  <Link href="/checkout">
                    <Button size="lg" className="w-full">
                      Finalizar Compra
                    </Button>
                  </Link>

                  <Link href="/">
                    <Button variant="outline" size="lg" className="w-full bg-transparent">
                      Continuar Comprando
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
