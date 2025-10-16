"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, ShoppingCart } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { ProductCard } from "@/components/product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { products } from "@/lib/data"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { getCartCount } = useCart()
  const cartCount = getCartCount()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen">
      <Sidebar cartItemCount={cartCount} />

      <main className="lg:pl-72">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="container mx-auto px-4 py-3">
            {/* Mobile Layout */}
            <div className="lg:hidden space-y-3">
              {/* Top row: Menu + Logo + Cart */}
              <div className="flex items-center justify-between gap-3">
                <Sidebar />

                <Link href="/" className="flex-1 flex justify-center">
                  <Image
                    src="/logo-atacadao.png"
                    alt="Atacadão Moto Peças"
                    width={150}
                    height={45}
                    className="w-auto h-8"
                    priority
                  />
                </Link>

                <Link href="/carrinho">
                  <Button variant="ghost" size="icon" className="relative shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>

              {/* Bottom row: Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar peças, capacetes, acessórios..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex-1 max-w-2xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar peças, capacetes, acessórios..."
                    className="pl-10 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Link href="/carrinho">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
                Equipamentos de Alta Performance para sua Moto
              </h1>
              <p className="text-lg text-primary-foreground/90 mb-6 text-pretty">
                As melhores marcas em peças, acessórios e equipamentos de segurança. Entrega rápida e parcelamento sem
                juros.
              </p>
              <Button size="lg" variant="secondary">
                Ver Ofertas
              </Button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {searchQuery ? "Resultados da Busca" : "Produtos em Destaque"}
            </h2>
            <p className="text-muted-foreground">
              {filteredProducts.length} {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Nenhum produto encontrado para "{searchQuery}"</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
