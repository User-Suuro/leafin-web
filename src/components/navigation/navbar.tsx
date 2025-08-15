"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/shadcn/ui/navigation-menu"
import { Home, LayoutDashboard, FileText } from "lucide-react"
import { ModeToggle } from "@/components/personalization/mode-toggle"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
    { href: "/system", label: "System", icon: <LayoutDashboard size={18} /> },
    { href: "/about", label: "About", icon: <FileText size={18} /> },
  ]

  return (
    <nav className="border-b px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Left - Logo */}
        <div className="text-xl font-bold text-green-700">
          🌿 Leafin Things
        </div>

        {/* Center - Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href))
                      ? "text-green-700"
                      : "hover:text-green-600"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>

              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right - Theme Toggle */}
        <ModeToggle />
      </div>
    </nav>
  )
}
