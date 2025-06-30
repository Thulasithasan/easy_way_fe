"use client"

import DeliveryAddressForm from "@/components/delivery-address-form"
import { useRouter } from "next/navigation"
import type { DeliveryAddressFormData } from "@/lib/schemas"

export default function AddAddressPage() {
  const router = useRouter()

  const handleAddAddress = (data: DeliveryAddressFormData) => {
    console.log("New address data:", data)
    // Here you would typically save to your backend
    router.push("/profile/addresses")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <DeliveryAddressForm onSubmit={handleAddAddress} />
    </div>
  )
}
