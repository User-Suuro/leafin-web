"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  ClipboardList,
  DollarSign,
  BarChart3,
  Settings,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shadcn/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shadcn/ui/tooltip";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/system/dashboard",
  },
  {
    title: "Monitoring",
    icon: Activity,
    href: "/system/monitoring",
  },
  {
    title: "Tasks",
    icon: ClipboardList,
    href: "/system/tasks",
  },

  {
    title: "Expenses",
    icon: CreditCard,
    href: "/system/expenses",
  },

  {
    title: "Sales",
    icon: DollarSign,
    href: "/system/sales",
  },
  {
    title: "Reports",
    icon: BarChart3,
    href: "/system/reports",
  },

  

];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <div className="flex h-full w-16 flex-col border-r bg-background">
        {/* Logo */}
        <div className="flex h-16 items-center justify-center border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <div className="h-4 w-4 rounded bg-primary-foreground" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-4 px-2 py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={cn(
                      "h-9 w-9 transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  {item.title}
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Settings - pushed to bottom */}
          <div className="mt-auto">
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant={pathname === "/settings" ? "default" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-9 w-9 transition-colors",
                    pathname === "/settings"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                  asChild
                >
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                Settings
              </TooltipContent>
            </Tooltip>
          </div>
        </nav>
      </div>
    </TooltipProvider>
  );
}
