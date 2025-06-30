"use client"

import { useEffect, useState, useCallback } from "react"
import { useInView } from "react-intersection-observer"
import ProductCard from "@/components/product-card"
import { useStore, type Product } from "@/lib/store"
import { productApi } from "@/lib/api"
import { useTranslation } from "@/lib/translations"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(null)

  const { language } = useStore()
  const t = useTranslation(language)

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  })

  const loadProducts = useCallback(
    async (pageNum: number, reset = false) => {
      if (loading) return

      setLoading(true)
      try {
        const response = await productApi.getHomeProducts({
          pageNumber: pageNum,
          pageSize: 10,
          categoryId: selectedCategory || undefined,
          subCategoryId: selectedSubCategory || undefined,
        })

        if (response.status === "successful" && response.results?.[0]?.items) {
          const newProducts = response.results[0].items

          if (reset) {
            setProducts(newProducts)
          } else {
            setProducts((prev) => [...prev, ...newProducts])
          }

          setHasMore(response.results[0].currentPage < response.results[0].totalPages - 1)
        }
      } catch (error) {
        console.error("Error loading products:", error)
        // Fallback to dummy data
        const dummyProducts: Product[] = Array.from({ length: 10 }, (_, i) => ({
          productId: i + 1,
          nameTranslations: [
            { language: "en", name: `Product ${i + 1}` },
            { language: "ta", name: `தயாரிப்பு ${i + 1}` },
          ],
          description: `Description for product ${i + 1}`,
          measurementValue: 1,
          measurementUnit: "KG",
          measurementSellingPrice: Math.floor(Math.random() * 500) + 50,
          heroImageSignedUrl: `/placeholder.svg?height=200&width=200`,
          isFavourite: false,
        }))

        if (reset) {
          setProducts(dummyProducts)
        } else {
          setProducts((prev) => [...prev, ...dummyProducts])
        }
      } finally {
        setLoading(false)
      }
    },
    [loading, selectedCategory, selectedSubCategory],
  )

  useEffect(() => {
    loadProducts(1, true)
    setPage(1)
  }, [selectedCategory, selectedSubCategory])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      const nextPage = page + 1
      setPage(nextPage)
      loadProducts(nextPage)
    }
  }, [inView, hasMore, loading, page, loadProducts])

  const categories = [
    { id: 1, name: { en: "Vegetables", ta: "காய்கறிகள்" } },
    { id: 2, name: { en: "Fruits", ta: "பழங்கள்" } },
    { id: 3, name: { en: "Grains", ta: "தானியங்கள்" } },
    { id: 4, name: { en: "Dairy", ta: "பால் பொருட்கள்" } },
  ]

  const subCategories = [
    { id: 1, categoryId: 1, name: { en: "Leafy Greens", ta: "கீரை வகைகள்" } },
    { id: 2, categoryId: 1, name: { en: "Root Vegetables", ta: "வேர் காய்கறிகள்" } },
    { id: 3, categoryId: 2, name: { en: "Citrus Fruits", ta: "சிட்ரஸ் பழங்கள்" } },
    { id: 4, categoryId: 2, name: { en: "Tropical Fruits", ta: "வெப்பமண்டல பழங்கள்" } },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-brand-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Fresh Groceries Delivered</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Get fresh vegetables, fruits, and daily essentials at your doorstep
          </p>
          <Button size="lg" variant="secondary" className="text-brand-primary">
            Shop Now
          </Button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t("categories")}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => {
                setSelectedCategory(null)
                setSelectedSubCategory(null)
              }}
              className="mb-2"
            >
              All Categories
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategory(category.id)
                  setSelectedSubCategory(null)
                }}
                className="mb-2"
              >
                {category.name[language]}
              </Button>
            ))}
          </div>

          {/* Subcategory Filters */}
          {selectedCategory && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedSubCategory === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedSubCategory(null)}
              >
                All Subcategories
              </Button>
              {subCategories
                .filter((sub) => sub.categoryId === selectedCategory)
                .map((subCategory) => (
                  <Button
                    key={subCategory.id}
                    variant={selectedSubCategory === subCategory.id ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSubCategory(subCategory.id)}
                  >
                    {subCategory.name[language]}
                  </Button>
                ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.productId} product={product} />
          ))}

          {/* Loading Skeletons */}
          {loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
        </div>

        {/* Infinite Scroll Trigger */}
        {hasMore && (
          <div ref={ref} className="h-20 flex items-center justify-center">
            {loading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading more products...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
