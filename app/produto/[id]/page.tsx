import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { products } from "@/lib/data"
import { ProductDetailClient } from "@/components/product-detail-client"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <main className="lg:pl-72">
        {/* Header */}
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
          {/* Product Title */}
          <div className="mb-8">
            <Badge variant="secondary" className="mb-3">
              {product.inStock ? "Em Estoque" : "Esgotado"}
            </Badge>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3 text-balance">{product.name}</h1>
            <p className="text-muted-foreground text-pretty leading-relaxed">{product.description}</p>
          </div>

          <ProductDetailClient product={product} />

          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="specs">Especificações</TabsTrigger>
                <TabsTrigger value="description">Descrição Detalhada</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações ({product.reviewCount})</TabsTrigger>
              </TabsList>

              <TabsContent value="specs" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      {product.specifications &&
                        Object.entries(product.specifications).map(([key, value]) => (
                          <div key={key} className="flex justify-between py-2 border-b border-border">
                            <span className="font-semibold capitalize">{key}</span>
                            <span className="text-muted-foreground">
                              {Array.isArray(value) ? value.join(", ") : value}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    <Separator className="my-6" />
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Características Principais</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Alta qualidade e durabilidade</li>
                        <li>Design moderno e funcional</li>
                        <li>Certificações de segurança</li>
                        <li>Garantia do fabricante</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Este produto tem {product.reviewCount} avaliações com média de {product.rating} estrelas.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        O sistema de avaliações detalhadas será implementado em breve.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
