import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://easy-way-be.thulasi-web.space"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth-token")
      localStorage.removeItem("refresh-token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Authentication API
export const authApi = {
  signIn: async (credentials: { email: string; password: string }) => {
    const response = await api.post("/v1/auth/sign-in", credentials)
    return response.data
  },

  signUp: async (userData: {
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    address: string
    city: string
    district: string
    province: string
    roleId: number
  }) => {
    const response = await api.post("/v1/auth/sign-up", userData)
    return response.data
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post("/v1/auth/refresh", { refreshToken })
    return response.data
  },

  signOut: async () => {
    const response = await api.post("/v1/auth/sign-out")
    return response.data
  },
}

export const productApi = {
  getHomeProducts: async (params: {
    productName?: string
    subCategoryId?: number
    categoryId?: number
    pageNumber: number
    pageSize: number
  }) => {
    const response = await api.get("/v1/stocks/home-products", { params })
    return response.data
  },

  getProductDetails: async (productId: number) => {
    const response = await api.get(`/v1/stocks/home-product-info/${productId}`)
    return response.data
  },
}

export const favoriteApi = {
  addToFavorites: async (productId: number) => {
    const response = await api.post(`/v1/favourites/${productId}`)
    return response.data
  },

  removeFromFavorites: async (productId: number) => {
    const response = await api.delete(`/v1/favourites/${productId}`)
    return response.data
  },

  getMyFavorites: async () => {
    const response = await api.get("/v1/favourites/my")
    return response.data
  },
}

export const cartApi = {
  addToCart: async (productId: number) => {
    const response = await api.post(`/v1/card-items/add/${productId}`)
    return response.data
  },

  removeFromCart: async (productId: number) => {
    const response = await api.delete(`/v1/card-items/remove/${productId}`)
    return response.data
  },

  getMyCart: async () => {
    const response = await api.get("/v1/card-items/my")
    return response.data
  },
}

export const recurringOrderApi = {
  create: async (data: { name: string; note: string }) => {
    const response = await api.post("/v1/recurring-orders/create", data)
    return response.data
  },

  addItem: async (recurringOrderId: number, productId: number) => {
    const response = await api.post(`/v1/recurring-orders/${recurringOrderId}/add-item/${productId}`)
    return response.data
  },

  getMy: async () => {
    const response = await api.get("/v1/recurring-orders/my")
    return response.data
  },

  removeItem: async (recurringOrderId: number, productId: number) => {
    const response = await api.delete(`/v1/recurring-orders/${recurringOrderId}/remove-item/${productId}`)
    return response.data
  },
}

export const orderApi = {
  create: async (data: {
    type: string
    status: string
    cardItemIds: number[]
    totalQuantity: number
    totalWeight: number
    customerId: number
    salesPersonId: number
    deliveryPersonId: number
  }) => {
    const response = await api.post("/v1/sales-orders/create", data)
    return response.data
  },
}

export const paymentApi = {
  create: async (orderId: number) => {
    const response = await api.post("/v1/payments/create", { orderId })
    return response.data
  },
}

export default api
