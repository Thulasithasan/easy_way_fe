"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Heart, ShoppingCart, Plus, Minus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore, type Product } from "@/lib/store"
import { useTranslation } from "@/lib/translations"
import { productApi, favoriteApi, cartApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number.parseInt(params.id as string)

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getProductDetails(productId)
        if (response.status === "successful" && response.results?.[0]) {
          setProduct(response.results[0])
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        // Fallback to dummy data
        setProduct({
          productId,
          nameTranslations: [
            { language: "en", name: "Sample Product" },
            { language: "ta", name: "மாதிரி தயாரிப்பு" },
          ],
          description: "This is a sample product description.",
          measurementValue: 1,
          measurementUnit: "KG",
          measurementSellingPrice: 100,
          heroImageSignedUrl: "/placeholder.svg?height=400&width=400",
          images: [
            "/placeholder.svg?height=400&width=400",
            "/placeholder.svg?height=400&width=400",
            "/placeholder.svg?height=400&width=400",
          ],
          isFavourite: false,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="flex space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
      </div>
    )
  }

  const productName =
    product.nameTranslations.find((translation) => translation.language === language)?.name ||
    product.nameTranslations[0]?.name ||
    "Product"

  const isFavorite = favorites.some((fav) => fav.productId === product.productId)
  const cartItem = cartItems.find((item) => item.productId === product.productId)
  const cartQuantity = cartItem?.quantity || 0

  const images = product.images || [product.heroImageSignedUrl]

  const handleToggleFavorite = async () => {
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
    }
  }

  const handleAddToCart = async () => {
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
    }
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (newQuantity === 0) {
      try {
        await cartApi.removeFromCart(product.productId)
        removeFromCart(product.productId)
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        })
      }
    } else {
      updateCartQuantity(product.productId, newQuantity)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={images[selectedImage] || "/placeholder.svg?height=400&width=400"}
              alt={productName}
              fill
              className="object-cover"
            />
          </div>

          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <Image
                    src={image || "/placeholder.svg?height=80&width=80"}
                    alt={`${productName} ${index + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{productName}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <Badge variant="secondary">Fresh</Badge>
              <Badge variant="outline">In Stock</Badge>
            </div>
            <div className="flex items-center space-x-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-600 ml-2">(4.5 out of 5)</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-3xl font-bold text-red-600">₹{product.measurementSellingPrice}</div>
            <div className="text-sm text-gray-600">
              Per {product.measurementValue} {product.measurementUnit}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {cartQuantity > 0 ? (
              <div className="flex items-center space-x-3 bg-red-50 dark:bg-red-950 rounded-lg p-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleUpdateQuantity(cartQuantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium text-red-600 min-w-[2rem] text-center">{cartQuantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full"
                  onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button onClick={handleAddToCart} className="bg-red-600 hover:bg-red-700 text-white px-8" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t("addToCart")}
              </Button>
            )}

            <Button variant="outline" size="lg" onClick={handleToggleFavorite} className="px-4 bg-transparent">
              <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="description">{t("description")}</TabsTrigger>
              <TabsTrigger value="reviews">{t("reviews")}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-gray-700 dark:text-gray-300">Customer reviews will be displayed here.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
