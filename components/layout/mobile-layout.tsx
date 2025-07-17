"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import MobileNavbar from "./mobile-navbar"
import BottomNavigation from "./bottom-navigation"

interface MobileLayoutProps {
  children: ReactNode
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  const pathname = usePathname()

  // Hide bottom nav on certain pages
  const hideBottomNav = ["/login", "/register", "/onboarding"].includes(pathname)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Mobile Header */}
      <MobileNavbar />

      {/* Main Content */}
      <main className={`flex-1 overflow-hidden ${!hideBottomNav ? "pb-16" : ""}`}>
        <div className="h-full overflow-y-auto overscroll-behavior-y-contain">{children}</div>
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && <BottomNavigation />}
    </div>
  )
}
