export const translations = {
  en: {
    // Navigation
    home: "Home",
    categories: "Categories",
    offers: "Offers",
    cart: "Cart",
    profile: "Profile",
    favorites: "Favorites",
    orders: "Orders",

    // Common
    search: "Search products...",
    addToCart: "Add to Cart",
    buyNow: "Buy Now",
    quantity: "Quantity",
    price: "Price",
    total: "Total",
    checkout: "Checkout",

    // Product
    productDetails: "Product Details",
    description: "Description",
    reviews: "Reviews",
    relatedProducts: "Related Products",

    // Cart
    yourCart: "Your Cart",
    emptyCart: "Your cart is empty",
    continueShopping: "Continue Shopping",

    // Footer
    aboutUs: "About Us",
    contactUs: "Contact Us",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",

    // Location
    selectLocation: "Select Location",

    // Theme
    toggleTheme: "Toggle Theme",

    // Language
    language: "Language",
    english: "English",
    tamil: "Tamil",
  },
  ta: {
    // Navigation
    home: "முகப்பு",
    categories: "வகைகள்",
    offers: "சலுகைகள்",
    cart: "கூடை",
    profile: "சுயவிவரம்",
    favorites: "விருப்பங்கள்",
    orders: "ஆர்டர்கள்",

    // Common
    search: "தயாரிப்புகளைத் தேடுங்கள்...",
    addToCart: "கூடையில் சேர்க்கவும்",
    buyNow: "இப்போது வாங்கவும்",
    quantity: "அளவு",
    price: "விலை",
    total: "மொத்தம்",
    checkout: "செக்அவுட்",

    // Product
    productDetails: "தயாரிப்பு விவரங்கள்",
    description: "விளக்கம்",
    reviews: "மதிப்புரைகள்",
    relatedProducts: "தொடர்புடைய தயாரிப்புகள்",

    // Cart
    yourCart: "உங்கள் கூடை",
    emptyCart: "உங்கள் கூடை காலியாக உள்ளது",
    continueShopping: "ஷாப்பிங்கைத் தொடரவும்",

    // Footer
    aboutUs: "எங்களைப் பற்றி",
    contactUs: "எங்களைத் தொடர்பு கொள்ளுங்கள்",
    privacyPolicy: "தனியுரிமைக் கொள்கை",
    termsOfService: "சேவை விதிமுறைகள்",

    // Location
    selectLocation: "இடத்தைத் தேர்ந்தெடுக்கவும்",

    // Theme
    toggleTheme: "தீம் மாற்றவும்",

    // Language
    language: "மொழி",
    english: "ஆங்கிலம்",
    tamil: "தமிழ்",
  },
}

export const useTranslation = (language: "en" | "ta") => {
  return (key: keyof typeof translations.en) => {
    return translations[language][key] || key
  }
}
