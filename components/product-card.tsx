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

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
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

  const productName =
    product.nameTranslations.find((translation) => translation.language === language)?.name ||
    product.nameTranslations[0]?.name ||
    "Product"

  const isFavorite = favorites.some((fav) => fav.productId === product.productId)
  const cartItem = cartItems.find((item) => item.productId === product.productId)
  const cartQuantity = cartItem?.quantity || 0

  const handleToggleFavorite = async () => {
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
    setIsLoadingCart(true)
    try {
      await cartApi.addToCart(product.productId)
      addToCart({
        productId: product.productId,
        nameTranslations: product.nameTranslations,
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
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="relative">
          <Link href={`/product/${product.productId}`}>
            <div className="aspect-square relative mb-3 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.heroImageSignedUrl || "/placeholder.svg?height=200&width=200"}
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
            onClick={handleToggleFavorite}
            disabled={isLoadingFavorite}
          >
            {isLoadingFavorite ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-brand-primary text-brand-primary" : "text-gray-600"}`} />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Link href={`/product/${product.productId}`}>
            <h3 className="font-medium text-sm line-clamp-2 hover:text-red-600 transition-colors">{productName}</h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              {product.measurementValue} {product.measurementUnit}
            </div>
            <Badge variant="secondary" className="text-xs">
              Fresh
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-bold text-lg text-brand-primary">₹{product.measurementSellingPrice}</div>
          </div>

          {cartQuantity > 0 ? (
            <div className="flex items-center justify-between bg-brand-light dark:bg-brand-dark/20 rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => handleUpdateQuantity(cartQuantity - 1)}
                disabled={isLoadingQuantity}
              >
                {isLoadingQuantity ? <Loader2 className="h-4 w-4 animate-spin" /> : <Minus className="h-4 w-4" />}
              </Button>
              <span className="font-medium text-red-600">{cartQuantity}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full"
                onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                disabled={isLoadingQuantity}
              >
                {isLoadingQuantity ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleAddToCart}
              disabled={isLoadingCart}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white"
              size="sm"
            >
              {isLoadingCart ? (
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
          )}
        </div>
      </CardContent>
    </Card>
  )
}
