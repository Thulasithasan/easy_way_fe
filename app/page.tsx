"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Filter, Grid, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  {
    productId: "4",
    nameTranslations: [
      { language: "en", name: "Brown Bread" },
      { language: "ta", name: "பிரெட்" },
    ],
    heroImageSignedUrl: "/placeholder.svg?height=200&width=200",
    measurementValue: 400,
    measurementUnit: "g",
    measurementSellingPrice: 35,
    measurementMrp: 40,
    categoryId: "bakery",
    isActive: true,
  },
  {
    productId: "5",
    nameTranslations: [
      { language: "en", name: "Basmati Rice" },
      { language: "ta", name: "பாஸ்மதி அரிசி" },
    ],
    heroImageSignedUrl: "/placeholder.svg?height=200&width=200",
    measurementValue: 1,
    measurementUnit: "kg",
    measurementSellingPrice: 85,
    measurementMrp: 100,
    categoryId: "grains",
    isActive: true,
  },
  {
    productId: "6",
    nameTranslations: [
      { language: "en", name: "Fresh Tomatoes" },
      { language: "ta", name: "தக்காளி" },
    ],
    heroImageSignedUrl: "/placeholder.svg?height=200&width=200",
    measurementValue: 500,
    measurementUnit: "g",
    measurementSellingPrice: 30,
    measurementMrp: 35,
    categoryId: "vegetables",
    isActive: true,
  },
]

const categories = [
  { id: "fruits", name: "Fruits", icon: "🍎", color: "bg-red-100 text-red-700" },
  { id: "vegetables", name: "Vegetables", icon: "🥕", color: "bg-green-100 text-green-700" },
  { id: "dairy", name: "Dairy", icon: "🥛", color: "bg-blue-100 text-blue-700" },
  { id: "bakery", name: "Bakery", icon: "🍞", color: "bg-yellow-100 text-yellow-700" },
  { id: "grains", name: "Grains", icon: "🌾", color: "bg-amber-100 text-amber-700" },
  { id: "snacks", name: "Snacks", icon: "🍿", color: "bg-purple-100 text-purple-700" },
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const { language, selectedLocation } = useStore()
  const t = useTranslation(language)

  useEffect(() => {
    // Simulate API call
    const loadProducts = async () => {
      setLoading(true)
      try {
        // In real app, this would be: await productApi.getProducts()
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setProducts(mockProducts)
      } catch (error) {
        console.error("Failed to load products:", error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.nameTranslations.some((t) => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Banner */}
      <div className="bg-brand-gradient text-white">
        <div className="px-4 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Welcome to Easy Way</h1>
                <p className="text-sm sm:text-base opacity-90">Fresh groceries delivered to your doorstep</p>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{selectedLocation}</span>
              </div>
            </div>

            {/* Search Bar - Mobile */}
            <div className="md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder={t("search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 w-full bg-white/90 border-0 text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4 bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Categories</h2>
            <Button variant="ghost" size="sm" className="text-brand-primary">
              View All
            </Button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="whitespace-nowrap flex-shrink-0"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap flex-shrink-0"
              >
                <span className="mr-1">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="px-4 py-3 bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            {selectedCategory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {categories.find((c) => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                  ×
                </button>
              </Badge>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1 border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {Array.from({ length: 10 }).map((_, i) => (
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
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedCategory
                    ? `${categories.find((c) => c.id === selectedCategory)?.name} (${filteredProducts.length})`
                    : `All Products (${filteredProducts.length})`}
                </h2>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-12 h-12 mx-auto mb-4" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No products found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
                      : "space-y-4"
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.productId} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
