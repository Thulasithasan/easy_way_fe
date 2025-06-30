"use client"

import { colors, getColor, colorCombinations } from "@/lib/colors"

// Theme color preview component for development
export function ThemeColorsPreview() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Easy Way Color System</h2>

      {/* Brand Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Brand Colors</h3>
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(colors.brand).map(([name, color]) => (
            <div key={name} className="text-center">
              <div className="w-16 h-16 rounded-lg border shadow-sm mx-auto mb-2" style={{ backgroundColor: color }} />
              <p className="text-sm font-medium capitalize">{name}</p>
              <p className="text-xs text-gray-500">{color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Semantic Colors */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Semantic Colors</h3>
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(colors.semantic).map(([name, color]) => (
            <div key={name} className="text-center">
              <div className="w-16 h-16 rounded-lg border shadow-sm mx-auto mb-2" style={{ backgroundColor: color }} />
              <p className="text-sm font-medium capitalize">{name}</p>
              <p className="text-xs text-gray-500">{color}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Color Combinations */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Color Combinations</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(colorCombinations).map(([name, combo]) => (
            <div key={name} className="text-center">
              <div
                className="w-24 h-16 rounded-lg border shadow-sm mx-auto mb-2 flex items-center justify-center text-sm font-medium"
                style={{
                  backgroundColor: combo.background,
                  color: combo.text,
                }}
              >
                {name}
              </div>
              <p className="text-sm font-medium capitalize">{name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Hook to use colors in components
export function useThemeColors() {
  return {
    colors,
    getColor,
    colorCombinations,
    // Helper functions
    getBrandColor: (shade: keyof typeof colors.brand) => colors.brand[shade],
    getSemanticColor: (type: keyof typeof colors.semantic) => colors.semantic[type],
    getNeutralColor: (shade: keyof typeof colors.neutral.gray) => colors.neutral.gray[shade],
  }
}
