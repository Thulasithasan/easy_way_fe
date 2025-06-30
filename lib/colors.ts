// Centralized Color Configuration
// Update colors here to change them throughout the entire project

export const colors = {
  // Brand Colors - Easy Way Theme
  brand: {
    primary: "#8B0000", // Dark Red/Maroon - Main brand color
    secondary: "#A0522D", // Saddle Brown - Secondary brand color
    accent: "#DC143C", // Crimson - Accent color for highlights
    light: "#FFE4E1", // Misty Rose - Light background
    dark: "#4A0000", // Very Dark Red - Dark variant
  },

  // Semantic Colors
  semantic: {
    success: "#22C55E", // Green for success states
    warning: "#F59E0B", // Amber for warnings
    error: "#EF4444", // Red for errors
    info: "#3B82F6", // Blue for information
  },

  // Neutral Colors
  neutral: {
    white: "#FFFFFF",
    black: "#000000",
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
  },

  // Component Specific Colors
  components: {
    navbar: {
      background: "#FFFFFF",
      backgroundDark: "#1F2937",
      text: "#374151",
      textDark: "#F9FAFB",
      border: "#E5E7EB",
    },
    button: {
      primary: "#8B0000",
      primaryHover: "#7A0000",
      secondary: "#F3F4F6",
      secondaryHover: "#E5E7EB",
    },
    card: {
      background: "#FFFFFF",
      backgroundDark: "#1F2937",
      border: "#E5E7EB",
      borderDark: "#374151",
    },
    input: {
      background: "#FFFFFF",
      backgroundDark: "#374151",
      border: "#D1D5DB",
      borderFocus: "#8B0000",
    },
  },

  // Status Colors
  status: {
    online: "#22C55E",
    offline: "#6B7280",
    pending: "#F59E0B",
    delivered: "#22C55E",
    cancelled: "#EF4444",
  },

  // Gradient Definitions
  gradients: {
    primary: "linear-gradient(135deg, #8B0000 0%, #DC143C 100%)",
    secondary: "linear-gradient(135deg, #A0522D 0%, #8B4513 100%)",
    hero: "linear-gradient(135deg, #8B0000 0%, #7A0000 100%)",
    card: "linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%)",
  },
} as const

// Color utility functions
export const getColor = (path: string): string => {
  const keys = path.split(".")
  let current: any = colors

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      console.warn(`Color path "${path}" not found`)
      return "#000000" // fallback color
    }
  }

  return typeof current === "string" ? current : "#000000"
}

// Predefined color combinations for common use cases
export const colorCombinations = {
  primary: {
    background: colors.brand.primary,
    text: colors.neutral.white,
    hover: colors.brand.dark,
  },
  secondary: {
    background: colors.brand.secondary,
    text: colors.neutral.white,
    hover: colors.brand.secondary,
  },
  success: {
    background: colors.semantic.success,
    text: colors.neutral.white,
    hover: "#16A34A",
  },
  error: {
    background: colors.semantic.error,
    text: colors.neutral.white,
    hover: "#DC2626",
  },
  neutral: {
    background: colors.neutral.gray[100],
    text: colors.neutral.gray[900],
    hover: colors.neutral.gray[200],
  },
} as const

// Export individual color categories for easier imports
export const brandColors = colors.brand
export const semanticColors = colors.semantic
export const neutralColors = colors.neutral
export const componentColors = colors.components
export const statusColors = colors.status
export const gradients = colors.gradients
