"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useCart } from "@/lib/cart-context"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/types"

interface ProductDetailClientProps {
  product: Product
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = () => {
    if (product.specifications?.size && !selectedSize) {
      toast({
        title: "Selecione um tamanho",
        description: "Por favor, escolha um tamanho antes de adicionar ao carrinho.",
        variant: "destructive",
      })
      return
    }

    if (product.specifications?.color && !selectedColor) {
      toast({
        title: "Selecione uma cor",
        description: "Por favor, escolha uma cor antes de adicionar ao carrinho.",
        variant: "destructive",
      })
      return
    }

    addToCart(product, quantity, {
      selectedSize,
      selectedColor,
    })

    toast({
      title: "Produto adicionado!",
      description: `${product.name} foi adicionado ao carrinho.`,
    })
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Image Carousel */}
      <div className="space-y-4">
        <Carousel className="w-full">
          <CarouselContent>
            {product.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={image || "/placeholder.svg?height=800&width=800"}
                    alt={`${product.name} - Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=800&width=800"
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {product.images.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>

        {/* Thumbnail Navigation */}
        {product.images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                  selectedImageIndex === index ? "border-primary" : "border-border hover:border-primary"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg?height=200&width=200"}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} avaliações)
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-4xl font-bold text-primary">R$ {product.price.toFixed(2).replace(".", ",")}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            em até 12x de R$ {(product.price / 12).toFixed(2).replace(".", ",")} sem juros
          </p>
        </div>

        <Separator />

        {/* Size Selection */}
        {product.specifications?.size && (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Tamanho</label>
            <div className="flex flex-wrap gap-2">
              {product.specifications.size.map((size) => (
                <Button
                  key={size}
                  variant={selectedSize === size ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Color Selection */}
        {product.specifications?.color && (
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">Cor</label>
            <div className="flex flex-wrap gap-2">
              {product.specifications.color.map((color) => (
                <Button
                  key={color}
                  variant={selectedColor === color ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Quantidade</label>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className="w-12 text-center font-semibold">{quantity}</span>
            <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)} disabled={quantity >= 10}>
              +
            </Button>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button size="lg" className="w-full" disabled={!product.inStock} onClick={handleAddToCart}>
            <ShoppingCart className="w-5 h-5 mr-2" />
            Adicionar ao Carrinho
          </Button>
          <Button size="lg" variant="outline" className="w-full bg-transparent">
            <Heart className="w-5 h-5 mr-2" />
            Adicionar aos Favoritos
          </Button>
        </div>

        {/* Benefits */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-primary">🚚</div>
              <div>
                <p className="font-semibold text-sm">Frete Grátis</p>
                <p className="text-xs text-muted-foreground">Para compras acima de R$ 299</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-primary">🛡️</div>
              <div>
                <p className="font-semibold text-sm">Garantia Estendida</p>
                <p className="text-xs text-muted-foreground">12 meses de garantia do fabricante</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-primary">💳</div>
              <div>
                <p className="font-semibold text-sm">Parcelamento</p>
                <p className="text-xs text-muted-foreground">Em até 12x sem juros no cartão</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
