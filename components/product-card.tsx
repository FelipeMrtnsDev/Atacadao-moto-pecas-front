"use client"

import Link from "next/link"
import Image from "next/image"
import { Star, Heart } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={`/produto/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {!product.inStock && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              Esgotado
            </Badge>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2 bg-background/80 hover:bg-background"
            onClick={(e) => {
              e.preventDefault()
              // TODO: Add to favorites
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/produto/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
        </div>

        <p className="text-2xl font-bold text-primary">R$ {product.price.toFixed(2).replace(".", ",")}</p>
        <p className="text-xs text-muted-foreground mt-1">em até 12x sem juros</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" disabled={!product.inStock}>
          {product.inStock ? "Ver Detalhes" : "Indisponível"}
        </Button>
      </CardFooter>
    </Card>
  )
}
