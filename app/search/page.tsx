"use client"

import { useState, useEffect } from "react"
import { Search, Clock, TrendingUp, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ProductCard from "@/components/product-card"
import { useStore, type Product } from "@/lib/store"
import { useTranslation } from "@/lib/translations"

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    productId: "1",
    nameTranslations: [
      { language: "en", name: "Fresh Bananas" },
      { language: "ta", name: "வாழைப்பழம்" },
    ],
    heroImageSignedUrl: "/placeholder.svg?height=200&width=200",
    measurementValue: 1,
    measurementUnit: "kg",
    measurementSellingPrice: 60,
    measurementMrp: 80,
    categoryId: "fruits",
    isActive: true,
  },
  {
    productId: "2",
    nameTranslations: [
      { language: "en", name: "Organic Apples" },
      { language: "ta", name: "ஆப்பிள்" },
    ],
    heroImageSignedUrl: "/placeholder.svg?height=200&width=200",
    measurementValue: 1,
    measurementUnit: "kg",
    measurementSellingPrice: 120,
    measurementMrp: 150,
    categoryId: "fruits",
    isActive: true,
  },
  {
    productId: "3",
    nameTranslations: [
      { language: "en", name: "Fresh Milk" },
      { language: "ta", name: "பால்" },
    ],
    heroImageSignedUrl: "/placeholder.svg?height=200&width=200",
    measurementValue: 500,
    measurementUnit: "ml",
    measurementSellingPrice: 25,
    measurementMrp: 30,
    categoryId: "dairy",
    isActive: true,
  },
]

const recentSearches = ["Bananas", "Milk", "Bread", "Apples", "Rice"]
const popularSearches = ["Vegetables", "Fruits", "Dairy", "Snacks", "Beverages"]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const { language } = useStore()
  const t = useTranslation(language)

  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true)
      setShowResults(true)

      // Simulate API call
      const searchProducts = async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        const filtered = mockProducts.filter((product) =>
          product.nameTranslations.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())),
        )
        setProducts(filtered)
        setLoading(false)
      }

      searchProducts()
    } else {
      setShowResults(false)
      setProducts([])
    }
  }, [searchQuery])

  const handleSearchSelect = (query: string) => {
    setSearchQuery(query)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowResults(false)
    setProducts([])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Search Header */}
      <div className="bg-white dark:bg-gray-800 border-b sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 py-3 w-full text-base"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {!showResults ? (
            <div className="space-y-6">
              {/* Recent Searches */}
              <div>
                <div className="flex items-center mb-3">
                  <Clock className="w-5 h-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-semibold">Recent Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearchSelect(search)}
                      className="rounded-full"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div>
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 text-gray-400 mr-2" />
                  <h2 className="text-lg font-semibold">Popular Searches</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSearchSelect(search)}
                      className="rounded-full"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h2 className="text-lg font-semibold mb-3">Browse Categories</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {[
                    { name: "Fruits & Vegetables", icon: "🥕", count: "150+ items" },
                    { name: "Dairy & Eggs", icon: "🥛", count: "80+ items" },
                    { name: "Bakery", icon: "🍞", count: "45+ items" },
                    { name: "Meat & Seafood", icon: "🐟", count: "60+ items" },
                    { name: "Beverages", icon: "🥤", count: "120+ items" },
                    { name: "Snacks", icon: "🍿", count: "90+ items" },
                  ].map((category, index) => (
                    <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{category.icon}</div>
                        <h3 className="font-medium text-sm mb-1">{category.name}</h3>
                        <p className="text-xs text-gray-500">{category.count}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Search Results Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {loading ? "Searching..." : `Results for "${searchQuery}" (${products.length})`}
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-1" />
                  Filter
                </Button>
              </div>

              {/* Search Results */}
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardContent className="p-3">
                        <Skeleton className="aspect-square w-full mb-3 rounded-lg" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2 mb-2" />
                        <Skeleton className="h-6 w-1/3 mb-3" />
                        <Skeleton className="h-8 w-full" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Search className="w-16 h-16 mx-auto mb-4" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    We couldn't find any products matching "{searchQuery}"
                  </p>
                  <Button onClick={clearSearch} variant="outline">
                    Clear Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                  {products.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
