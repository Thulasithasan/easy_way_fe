"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Search, ShoppingCart, Heart, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/cart", icon: ShoppingCart, label: "Cart", showBadge: true },
  { href: "/favorites", icon: Heart, label: "Favorites", showBadge: true },
  { href: "/profile", icon: User, label: "Profile" },
]

export default function BottomNavigation() {
  const pathname = usePathname()
  const { cartItems, favorites } = useStore()

  const getBadgeCount = (item: (typeof navItems)[0]) => {
    if (item.href === "/cart") return cartItems.length
    if (item.href === "/favorites") return favorites.length
    return 0
  }

  // Hide bottom nav on certain pages and on desktop
  const hideBottomNav = ["/login", "/register"].includes(pathname)

  if (hideBottomNav) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          const badgeCount = getBadgeCount(item)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 transition-all duration-200 active:scale-95",
                isActive
                  ? "text-brand-primary"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
              )}
            >
              <div className="relative">
                <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                {item.showBadge && badgeCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </Badge>
                )}
              </div>
              <span className={cn("text-xs font-medium", isActive && "text-brand-primary")}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
