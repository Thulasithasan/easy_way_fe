"use client"

import { useState, useEffect } from "react"
import { X, Gift, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const promos = [
  {
    id: 1,
    title: "🎉 50% OFF",
    subtitle: "On your first order",
    code: "FIRST50",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    id: 2,
    title: "⚡ Free Delivery",
    subtitle: "Orders above ₹500",
    code: "FREESHIP",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "🕒 Flash Sale",
    subtitle: "Limited time offer",
    code: "FLASH24",
    gradient: "from-purple-500 to-indigo-500",
  },
]

export default function PromoBanner() {
  const [currentPromo, setCurrentPromo] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const promo = promos[currentPromo]

  return (
    <div className="px-4 mb-6">
      <div
        className={cn("relative bg-gradient-to-r rounded-2xl p-4 text-white shadow-lg overflow-hidden", promo.gradient)}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white rounded-full" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white rounded-full" />
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{promo.title}</h3>
              <p className="text-white/90 text-sm">{promo.subtitle}</p>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3" />
                <span className="text-xs">Code: {promo.code}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Dots */}
        <div className="flex space-x-1 mt-3 justify-center">
          {promos.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentPromo ? "bg-white" : "bg-white/40",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
