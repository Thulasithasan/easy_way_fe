"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Bell, MapPin, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useStore } from "@/lib/store"
import { useTranslation } from "@/lib/translations"

export default function MobileNavbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { language, selectedLocation, user } = useStore()
  const t = useTranslation(language)

  return (
    <>
      {/* Status Bar Spacer for iOS */}
      <div className="h-safe-top bg-white dark:bg-gray-900" />

      {/* Main Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
        <div className="px-4 py-3">
          {!isSearchOpen ? (
            <div className="flex items-center justify-between">
              {/* Logo & Location */}
              <div className="flex items-center space-x-3">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">EW</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">Easy Way</span>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span>{selectedLocation}</span>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(true)} className="h-9 w-9 p-0">
                  <Search className="h-5 w-5" />
                </Button>

                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 relative">
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="py-6">
                      <h2 className="text-lg font-semibold mb-4">Menu</h2>
                      {/* Menu content */}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t("search")}
                  className="pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-brand-primary"
                  autoFocus
                />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsSearchOpen(false)} className="text-brand-primary">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
