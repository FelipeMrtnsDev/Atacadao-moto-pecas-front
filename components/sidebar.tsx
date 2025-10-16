"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { categories } from "@/lib/data"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"

type SidebarProps = {}

export function Sidebar() {
  const [open, setOpen] = useState(false)
  const { getCartCount } = useCart()
  const cartItemCount = getCartCount()
  const { user, isAuthenticated, logout } = useAuth()

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/logo-atacadao.png"
            alt="Atacadão Moto Peças"
            width={200}
            height={60}
            className="w-auto h-12"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categorias</h2>
        </div>

        {categories.map((category) => (
          <div key={category.id} className="space-y-1">
            <Link
              href={`/categoria/${category.id}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-sidebar-accent transition-colors group"
            >
              <span className="text-xl">{category.icon}</span>
              <span className="font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground">
                {category.name}
              </span>
            </Link>

            {category.subcategories && (
              <div className="ml-11 space-y-1">
                {category.subcategories.map((sub) => (
                  <Link
                    key={sub}
                    href={`/categoria/${category.id}/${sub.toLowerCase()}`}
                    onClick={() => setOpen(false)}
                    className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {sub}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Link href="/carrinho" onClick={() => setOpen(false)}>
          <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
            <ShoppingCart className="w-4 h-4" />
            Carrinho
            {cartItemCount > 0 && (
              <Badge variant="destructive" className="ml-auto">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </Link>

        {isAuthenticated ? (
          <>
            <div className="px-3 py-2">
              <p className="text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => {
                logout()
                setOpen(false)
              }}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </>
        ) : (
          <Link href="/login" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <User className="w-4 h-4" />
              Minha Conta
            </Button>
          </Link>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-72 bg-sidebar border-r border-sidebar-border">
        <SidebarContent />
      </aside>
    </>
  )
}
