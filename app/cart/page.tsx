"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { useTranslation } from "@/lib/translations"
import { cartApi, orderApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)
  const [loadingItems, setLoadingItems] = useState<{ [key: number]: boolean }>({})

  const { language, cartItems, cartTotal, removeFromCart, updateCartQuantity, clearCart, user } = useStore()
  const t = useTranslation(language)
  const { toast } = useToast()

  const setItemLoading = (productId: number, loading: boolean) => {
    setLoadingItems((prev) => ({ ...prev, [productId]: loading }))
  }

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    setItemLoading(productId, true)
    try {
      if (newQuantity === 0) {
        await cartApi.removeFromCart(productId)
        removeFromCart(productId)
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
        })
      } else {
        updateCartQuantity(productId, newQuantity)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setItemLoading(productId, false)
    }
  }

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout.",
        variant: "destructive",
      })
      return
    }

    setIsLoadingCheckout(true)
    try {
      const cardItemIds = cartItems.map((item) => item.cardItemId).filter(Boolean) as number[]

      const orderData = {
        type: "ONLINE",
        status: "ORDER_PENDING",
        cardItemIds,
        totalQuantity: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        totalWeight: 0,
        customerId: user.userId || 0,
        salesPersonId: 0,
        deliveryPersonId: 0,
      }

      console.log("Creating order with data:", orderData)
      const response = await orderApi.create(orderData)

      if (response.status === "successful") {
        clearCart()
        toast({
          title: "Order placed successfully!",
          description: "Your order has been placed and is being processed.",
        })
        // Redirect to order confirmation or payment page
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingCheckout(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t("emptyCart")}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Add some products to get started</p>
        <Link href="/">
          <Button className="bg-brand-primary hover:bg-brand-dark text-white">{t("continueShopping")}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">{t("yourCart")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const productName =
              item.nameTranslations.find((translation) => translation.language === language)?.name ||
              item.nameTranslations[0]?.name ||
              "Product"

            const isItemLoading = loadingItems[item.productId!] || false

            return (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.heroImageSignedUrl || "/placeholder.svg?height=80&width=80"}
                        alt={productName}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info and Controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base line-clamp-2">
                            {productName}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            ₹{item.measurementPrice} each
                          </p>
                        </div>

                        {/* Price - Top Right */}
                        <div className="flex-shrink-0 text-right">
                          <p className="font-bold text-lg sm:text-xl text-brand-primary">
                            ₹{(item.measurementPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls and Delete */}
                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 rounded-full p-0 bg-transparent"
                            onClick={() => handleUpdateQuantity(item.productId!, item.quantity - 1)}
                            disabled={isItemLoading}
                          >
                            {isItemLoading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                          </Button>
                          <span className="font-medium min-w-[2rem] text-center text-sm px-2">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 rounded-full p-0 bg-transparent"
                            onClick={() => handleUpdateQuantity(item.productId!, item.quantity + 1)}
                            disabled={isItemLoading}
                          >
                            {isItemLoading ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Plus className="h-3 w-3" />
                            )}
                          </Button>
                        </div>

                        {/* Delete Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 p-2"
                          onClick={() => handleUpdateQuantity(item.productId!, 0)}
                          disabled={isItemLoading}
                          title="Remove item"
                        >
                          {isItemLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{t("total")}</span>
                <span>₹{cartTotal}</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={isLoadingCheckout}
                className="w-full bg-brand-primary hover:bg-brand-dark text-white"
                size="lg"
              >
                {isLoadingCheckout ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  t("checkout")
                )}
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full bg-transparent" disabled={isLoadingCheckout}>
                  {t("continueShopping")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
