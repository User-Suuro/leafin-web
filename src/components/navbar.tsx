"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/shadcn/ui/navigation-menu";
import {
  Home,
  LayoutDashboard,
  Info,
  FileText,
  Mail,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: <Home size={18} /> },
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { href: "/about", label: "About", icon: <Info size={18} /> },
    { href: "/docs", label: "Docs", icon: <FileText size={18} /> },
    { href: "/contact", label: "Contact", icon: <Mail size={18} /> },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold text-green-700">
          🌿 Leafin Things
        </div>

        <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            {navItems.map((item) => (
              <NavigationMenuItem key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "text-green-700"
                      : "text-gray-700 hover:text-green-600"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
