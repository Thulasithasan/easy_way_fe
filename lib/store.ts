import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  productId: number
  nameTranslations: Array<{
    language: string
    name: string
  }>
  description: string
  measurementValue: number
  measurementUnit: string
  measurementSellingPrice: number
  heroImageSignedUrl: string
  isFavourite: boolean
  images?: string[]
}

export interface CartItem {
  cardItemId?: number
  nameTranslations: Array<{
    language: string
    name: string
  }>
  heroImageSignedUrl: string
  measurementPrice: number
  quantity: number
  productId?: number
}

export interface User {
  userId?: number
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  address?: string
  city?: string
  district?: string
  province?: string
  avatar?: string
  roleResponseDto?: {
    roleId: number
    name: string
    description: string
    permissions: Array<{
      permissionId: number
      name: string
      description: string
      subPermissions: string[]
    }>
  }
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// Updated Favorite interface to match API response
export interface FavoriteProduct {
  productId: number
  nameTranslations: Array<{
    language: string
    name: string
  }>
  heroImageSignedUrl: string
  measurementSellingPrice?: number
  description?: string
  measurementValue?: number
  measurementUnit?: string
  isFavourite?: boolean
}

interface AppState {
  // Authentication
  user: User | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  setTokens: (tokens: AuthTokens | null) => void
  logout: () => void

  // Language
  language: "en" | "ta"
  setLanguage: (lang: "en" | "ta") => void

  // Location
  selectedLocation: string
  setSelectedLocation: (location: string) => void

  // Cart
  cartItems: CartItem[]
  cartTotal: number
  setCartItems: (items: CartItem[]) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: number) => void
  updateCartQuantity: (productId: number, quantity: number) => void
  clearCart: () => void

  // Favorites - Updated to use new interface
  favorites: FavoriteProduct[]
  setFavorites: (favorites: FavoriteProduct[]) => void
  addToFavorites: (product: Product | FavoriteProduct) => void
  removeFromFavorites: (productId: number) => void

  // Products
  products: Product[]
  setProducts: (products: Product[]) => void

  // Loading states
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Authentication
      user: null,
      tokens: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (tokens) => {
        set({ tokens })
        if (tokens) {
          localStorage.setItem("auth-token", tokens.accessToken)
          localStorage.setItem("refresh-token", tokens.refreshToken)
        } else {
          localStorage.removeItem("auth-token")
          localStorage.removeItem("refresh-token")
        }
      },
      logout: () => {
        set({ user: null, tokens: null, isAuthenticated: false })
        localStorage.removeItem("auth-token")
        localStorage.removeItem("refresh-token")
      },

      // Language
      language: "en",
      setLanguage: (lang) => set({ language: lang }),

      // Location
      selectedLocation: "Chennai",
      setSelectedLocation: (location) => set({ selectedLocation: location }),

      // Cart
      cartItems: [],
      cartTotal: 0,
      setCartItems: (items) => {
        const total = items.reduce((sum, item) => sum + item.measurementPrice * item.quantity, 0)
        set({ cartItems: items, cartTotal: total })
      },
      addToCart: (item) => {
        const { cartItems } = get()
        const existingItem = cartItems.find((i) => i.productId === item.productId)

        if (existingItem) {
          get().updateCartQuantity(item.productId!, existingItem.quantity + 1)
        } else {
          const newItems = [...cartItems, { ...item, quantity: 1 }]
          get().setCartItems(newItems)
        }
      },
      removeFromCart: (productId) => {
        const { cartItems } = get()
        const newItems = cartItems.filter((item) => item.productId !== productId)
        get().setCartItems(newItems)
      },
      updateCartQuantity: (productId, quantity) => {
        const { cartItems } = get()
        const newItems = cartItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        get().setCartItems(newItems)
      },
      clearCart: () => set({ cartItems: [], cartTotal: 0 }),

      // Favorites - Updated implementation
      favorites: [],
      setFavorites: (favorites) => set({ favorites }),
      addToFavorites: (product) => {
        const { favorites } = get()

        // Convert Product to FavoriteProduct if needed
        const favoriteProduct: FavoriteProduct = {
          productId: product.productId,
          nameTranslations: product.nameTranslations,
          heroImageSignedUrl: product.heroImageSignedUrl,
          measurementSellingPrice: "measurementSellingPrice" in product ? product.measurementSellingPrice : undefined,
          description: "description" in product ? product.description : undefined,
          measurementValue: "measurementValue" in product ? product.measurementValue : undefined,
          measurementUnit: "measurementUnit" in product ? product.measurementUnit : undefined,
          isFavourite: true,
        }

        if (!favorites.find((p) => p.productId === favoriteProduct.productId)) {
          set({ favorites: [...favorites, favoriteProduct] })
        }
      },
      removeFromFavorites: (productId) => {
        const { favorites } = get()
        set({ favorites: favorites.filter((p) => p.productId !== productId) })
      },

      // Products
      products: [],
      setProducts: (products) => set({ products }),

      // Loading states
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "easyway-store",
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        isAuthenticated: state.isAuthenticated,
        language: state.language,
        selectedLocation: state.selectedLocation,
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
        favorites: state.favorites,
      }),
    },
  ),
)
