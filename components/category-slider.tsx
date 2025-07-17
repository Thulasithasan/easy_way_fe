"use client"

import { useState } from "react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Apple, Carrot, Wheat, Milk, Fish, Cookie } from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { id: 1, name: "Fruits", icon: Apple, color: "bg-green-100 text-green-600" },
  { id: 2, name: "Vegetables", icon: Carrot, color: "bg-orange-100 text-orange-600" },
  { id: 3, name: "Grains", icon: Wheat, color: "bg-yellow-100 text-yellow-600" },
  { id: 4, name: "Dairy", icon: Milk, color: "bg-blue-100 text-blue-600" },
  { id: 5, name: "Seafood", icon: Fish, color: "bg-cyan-100 text-cyan-600" },
  { id: 6, name: "Snacks", icon: Cookie, color: "bg-purple-100 text-purple-600" },
]

interface CategorySliderProps {
  onCategorySelect: (categoryId: number | null) => void
}

export default function CategorySlider({ onCategorySelect }: CategorySliderProps) {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)

  const handleCategorySelect = (categoryId: number) => {
    const newSelection = selectedCategory === categoryId ? null : categoryId
    setSelectedCategory(newSelection)
    onCategorySelect(newSelection)
  }

  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Categories</h2>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-3 pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.id

            return (
              <Button
                key={category.id}
                variant="ghost"
                onClick={() => handleCategorySelect(category.id)}
                className={cn(
                  "flex-shrink-0 flex flex-col items-center space-y-2 p-3 h-auto rounded-2xl transition-all duration-200 active:scale-95",
                  isSelected
                    ? "bg-brand-primary text-white shadow-lg"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700",
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-colors",
                    isSelected ? "bg-white/20" : category.color,
                  )}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-medium">{category.name}</span>
              </Button>
            )
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
