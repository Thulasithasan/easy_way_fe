"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Plus, Minus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useStore, type Product } from "@/lib/store"
import { useTranslation } from "@/lib/translations"
import { favoriteApi, cartApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const translations = product?.nameTranslations ?? []
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false)
  const [isLoadingCart, setIsLoadingCart] = useState(false)
  const [isLoadingQuantity, setIsLoadingQuantity] = useState(false)

  const {
    language,
    cartItems,
    favorites,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    addToFavorites,
    removeFromFavorites,
  } = useStore()
  const t = useTranslation(language)
  const { toast } = useToast()

  const productName = translations.find((t) => t.language === language)?.name ?? translations[0]?.name ?? "Product"

  const isFavorite = favorites.some((fav) => fav.productId === product.productId)
  const cartItem = cartItems.find((item) => item.productId === product.productId)
  const cartQuantity = cartItem?.quantity || 0

  const handleToggleFavorite = async () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(10)
    }

    setIsLoadingFavorite(true)
    try {
      if (isFavorite) {
        await favoriteApi.removeFromFavorites(product.productId)
        removeFromFavorites(product.productId)
        toast({
          title: "Removed from favorites",
          description: `${productName} has been removed from your favorites.`,
        })
      } else {
        await favoriteApi.addToFavorites(product.productId)
        addToFavorites(product)
        toast({
          title: "Added to favorites",
          description: `${productName} has been added to your favorites.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingFavorite(false)
    }
  }

  const handleAddToCart = async () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(20)
    }

    setIsLoadingCart(true)
    try {
      await cartApi.addToCart(product.productId)
      addToCart({
        productId: product.productId,
        nameTranslations: translations,
        heroImageSignedUrl: product.heroImageSignedUrl,
        measurementPrice: product.measurementSellingPrice,
        quantity: 1,
      })
      toast({
        title: "Added to cart",
        description: `${productName} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCart(false)
    }
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    setIsLoadingQuantity(true)
    try {
      if (newQuantity === 0) {
        await cartApi.removeFromCart(product.productId)
        removeFromCart(product.productId)
      } else {
        updateCartQuantity(product.productId, newQuantity)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingQuantity(false)
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white dark:bg-gray-800 rounded-lg overflow-hidden h-full">
      <CardContent className="p-2 sm:p-3 h-full flex flex-col">
        <div className="relative mb-2 sm:mb-3">
          <Link href={`/product/${product.productId}`}>
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.heroImageSignedUrl || "/placeholder.svg?height=200&width=200"}
                alt={productName}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-200"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              />
            </div>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm p-0"
            onClick={handleToggleFavorite}
            disabled={isLoadingFavorite}
          >
            {isLoadingFavorite ? (
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
            ) : (
              <Heart
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500",
                )}
              />
            )}
          </Button>

          <Badge
            variant="secondary"
            className="absolute top-1 left-1 text-xs px-1 py-0 bg-green-100 text-green-700 border-0"
          >
            Fresh
          </Badge>
        </div>

        <div className="flex-1 flex flex-col space-y-1 sm:space-y-2">
          <Link href={`/product/${product.productId}`}>
            <h3 className="font-medium text-xs sm:text-sm line-clamp-2 hover:text-brand-primary transition-colors leading-tight min-h-[2.5rem] sm:min-h-[2.8rem]">
              {productName}
            </h3>
          </Link>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="truncate">
              {product.measurementValue} {product.measurementUnit}
            </span>
            <div className="flex items-center space-x-1 flex-shrink-0">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-xs">Stock</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-bold text-sm sm:text-base text-brand-primary">₹{product.measurementSellingPrice}</div>
            {product.measurementMrp && product.measurementMrp > product.measurementSellingPrice && (
              <div className="text-xs text-gray-400 line-through">₹{product.measurementMrp}</div>
            )}
          </div>

          <div className="mt-auto pt-1 sm:pt-2">
            {cartQuantity > 0 ? (
              <div className="flex items-center justify-between bg-brand-light dark:bg-brand-dark/20 rounded-full p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-white p-0 flex-shrink-0"
                  onClick={() => handleUpdateQuantity(cartQuantity - 1)}
                  disabled={isLoadingQuantity}
                >
                  {isLoadingQuantity ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
                <span className="font-semibold text-brand-primary text-sm px-2 flex-shrink-0">{cartQuantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 sm:h-7 sm:w-7 rounded-full hover:bg-white p-0 flex-shrink-0"
                  onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                  disabled={isLoadingQuantity}
                >
                  {isLoadingQuantity ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleAddToCart}
                disabled={isLoadingCart}
                className="w-full bg-brand-primary hover:bg-brand-dark text-white rounded-full shadow-sm active:scale-95 transition-all duration-200 h-7 sm:h-8 text-xs sm:text-sm"
                size="sm"
              >
                {isLoadingCart ? (
                  <>
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 animate-spin" />
                    <span className="hidden sm:inline">Adding...</span>
                    <span className="sm:hidden">...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">Add</span>
                    <span className="sm:hidden">+</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
