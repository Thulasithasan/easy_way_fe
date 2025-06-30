"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, Trash2, ShoppingCart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useStore } from "@/lib/store"
import { useTranslation } from "@/lib/translations"
import { favoriteApi, cartApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface FavoriteItem {
  id: number
  productNameResponseDtos: Array<{
    language: string
    name: string
  }>
  heroImageSignedUrl: string
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>({})
  const { language, user, addToCart, removeFromFavorites } = useStore()
  const t = useTranslation(language)
  const { toast } = useToast()

  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        console.log("Loading favorites...")
        const response = await favoriteApi.getMyFavorites()
        console.log("Favorites API response:", response)

        if (response.status === "successful" && response.results) {
          setFavorites(response.results)
        } else {
          console.error("Failed to load favorites:", response)
        }
      } catch (error) {
        console.error("Error loading favorites:", error)
        toast({
          title: "Error",
          description: "Failed to load favorites. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadFavorites()
  }, [user, toast])

  const setItemLoading = (productId: number, loading: boolean) => {
    setLoadingItems((prev) => ({ ...prev, [productId]: loading }))
  }

  const handleRemoveFromFavorites = async (productId: number) => {
    setItemLoading(productId, true)
    try {
      await favoriteApi.removeFromFavorites(productId)
      setFavorites((prev) => prev.filter((item) => item.id !== productId))
      removeFromFavorites(productId)
      toast({
        title: "Removed from favorites",
        description: "Item has been removed from your favorites.",
      })
    } catch (error) {
      console.error("Error removing from favorites:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setItemLoading(productId, false)
    }
  }

  const handleAddToCart = async (item: FavoriteItem) => {
    setItemLoading(item.id, true)
    try {
      await cartApi.addToCart(item.id)

      // Convert favorite item to cart item format
      addToCart({
        productId: item.id,
        nameTranslations: item.productNameResponseDtos.map((dto) => ({
          language: dto.language,
          name: dto.name,
        })),
        heroImageSignedUrl: item.heroImageSignedUrl,
        measurementPrice: 0, // Price not available in favorites API
        quantity: 1,
      })

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart.",
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setItemLoading(item.id, false)
    }
  }

  // Show login required if user is not logged in
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">You need to login to view your favorites</p>
        <Link href="/login">
          <Button className="bg-brand-primary hover:bg-brand-dark text-white">Login</Button>
        </Link>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("favorites")}</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Show empty state
  if (favorites.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Heart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Favorites Yet</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Start adding products to your favorites to see them here
        </p>
        <Link href="/">
          <Button className="bg-brand-primary hover:bg-brand-dark text-white">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>
    )
  }

  // Show favorites
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t("favorites")}</h1>
        <p className="text-gray-600 dark:text-gray-400">{favorites.length} items</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {favorites.map((item) => {
          const productName =
            item.productNameResponseDtos.find((dto) => dto.language === language)?.name ||
            item.productNameResponseDtos[0]?.name ||
            "Product"

          const isItemLoading = loadingItems[item.id] || false

          return (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-4">
                <div className="relative">
                  <Link href={`/product/${item.id}`}>
                    <div className="aspect-square relative mb-3 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.heroImageSignedUrl || "/placeholder.svg?height=200&width=200"}
                        alt={productName}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    disabled={isItemLoading}
                  >
                    {isItemLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-600" />
                    )}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Link href={`/product/${item.id}`}>
                    <h3 className="font-medium text-sm line-clamp-2 hover:text-red-600 transition-colors">
                      {productName}
                    </h3>
                  </Link>

                  <Button
                    onClick={() => handleAddToCart(item)}
                    disabled={isItemLoading}
                    className="w-full bg-brand-primary hover:bg-brand-dark text-white"
                    size="sm"
                  >
                    {isItemLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t("addToCart")}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
