"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, User, MapPin, Heart, Menu, X, Sun, Moon, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useStore } from "@/lib/store"
import { useTranslation } from "@/lib/translations"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, selectedLocation, setSelectedLocation, cartItems, favorites, user, logout } =
    useStore()
  const t = useTranslation(language)
  const { toast } = useToast()

  const locations = ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"]

  return (
    <>
      {/* Promotion Banner */}
      <div className="bg-brand-gradient text-white text-center py-2 text-sm">
        🎉 Free delivery on orders above ₹500! Use code: FREESHIP
      </div>

      <nav className="bg-white dark:bg-gray-900 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">EW</span>
              </div>
              <span className="text-xl font-bold text-brand-primary dark:text-brand-accent">Easy Way</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input type="text" placeholder={t("search")} className="pl-10 pr-4 py-2 w-full" />
              </div>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Location Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden md:flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{selectedLocation}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {locations.map((location) => (
                    <DropdownMenuItem key={location} onClick={() => setSelectedLocation(location)}>
                      {location}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Toggle */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Globe className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage("en")}>{t("english")}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ta")}>{t("tamil")}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button variant="ghost" size="sm" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              {/* Favorites - Hidden on mobile */}
              <Link href="/favorites" className="hidden md:block">
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="w-5 h-5" />
                  {favorites.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {favorites.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Cart - Hidden on mobile */}
              <Link href="/cart" className="hidden md:block">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {cartItems.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar || "/placeholder.svg"}
                        alt={`${user.firstName} ${user.lastName}`}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user ? (
                    <>
                      <DropdownMenuItem>
                        <div className="flex flex-col">
                          <span className="font-medium">{`${user.firstName} ${user.lastName}`}</span>
                          <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/profile">{t("profile")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/orders">{t("orders")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="md:hidden">
                        <Link href="/favorites">{t("favorites")}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          logout()
                          toast({
                            title: "Logged out successfully",
                            description: "You have been logged out of your account.",
                          })
                        }}
                      >
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem>
                        <Link href="/login">Login</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href="/register">Register</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input type="text" placeholder={t("search")} className="pl-10 pr-4 py-2 w-full" />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t">
            <div className="px-4 py-2 space-y-2">
              <Link href="/" className="block py-2 text-gray-700 dark:text-gray-300">
                {t("home")}
              </Link>
              <Link href="/categories" className="block py-2 text-gray-700 dark:text-gray-300">
                {t("categories")}
              </Link>
              <Link href="/offers" className="block py-2 text-gray-700 dark:text-gray-300">
                {t("offers")}
              </Link>
              <div className="py-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedLocation}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {locations.map((location) => (
                      <DropdownMenuItem key={location} onClick={() => setSelectedLocation(location)}>
                        {location}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
