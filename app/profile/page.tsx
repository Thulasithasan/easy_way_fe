"use client"

import Link from "next/link"
import { User, Mail, Phone, MapPin, Edit, Heart, ShoppingBag, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useTranslation } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { language, user, logout } = useStore()
  const t = useTranslation(language)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
    router.push("/")
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <User className="w-24 h-24 mx-auto text-gray-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">You need to login to view your profile</p>
        <Link href="/login">
          <Button className="bg-brand-primary hover:bg-brand-dark text-white">Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={`${user.firstName} ${user.lastName}`} />
                <AvatarFallback className="text-2xl bg-brand-primary text-white">
                  {user.firstName?.charAt(0) || "U"}
                  {user.lastName?.charAt(0) || ""}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-xl">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
              {user.roleResponseDto && (
                <Badge variant="secondary" className="mt-2">
                  {user.roleResponseDto.name}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm truncate">{user.email}</span>
              </div>
              {user.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">{user.phoneNumber}</span>
                </div>
              )}
              {user.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">
                    {user.address}
                    {user.city && `, ${user.city}`}
                    {user.province && `, ${user.province}`}
                  </span>
                </div>
              )}
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/profile/edit">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Orders */}
            <Link href="/orders">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-brand-primary" />
                    <span>{t("orders")}</span>
                  </CardTitle>
                  <CardDescription>View your order history and track current orders</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Favorites */}
            <Link href="/favorites">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-brand-primary" />
                    <span>{t("favorites")}</span>
                  </CardTitle>
                  <CardDescription>View and manage your favorite products</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Addresses */}
            <Link href="/address/add">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-brand-primary" />
                    <span>Addresses</span>
                  </CardTitle>
                  <CardDescription>Manage your delivery addresses</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Settings */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-brand-primary" />
                  <span>Settings</span>
                </CardTitle>
                <CardDescription>Account settings and preferences</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Account Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Settings className="w-4 h-4 mr-2" />
                Change Password
              </Button>
              <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
