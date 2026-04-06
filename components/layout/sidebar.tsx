"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Map,
  Car,
  Leaf,
  Zap,
  Shield,
  BarChart3,
  Bot,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Smart Routing", href: "/routing", icon: Map },
  { name: "Mobility Hub", href: "/mobility", icon: Car },
  { name: "Environment", href: "/environment", icon: Leaf },
  { name: "Utilities", href: "/utilities", icon: Zap },
  { name: "Safety", href: "/safety", icon: Shield },
  { name: "Insights", href: "/insights", icon: BarChart3 },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
  { name: "Profile", href: "/profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const { emergencyMode } = useTheme()

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 glass-strong border-r border-glass-border transition-all duration-300 flex flex-col z-50",
        collapsed ? "w-16" : "w-64",
        emergencyMode && "border-emergency/50"
      )}
    >
      {/* Logo */}
      <div className={cn(
        "p-4 border-b border-glass-border flex items-center gap-3",
        emergencyMode && "border-emergency/50"
      )}>
        <div className={cn(
          "w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-sm shrink-0",
          emergencyMode && "from-emergency to-destructive animate-pulse"
        )}>
          <span className="text-primary-foreground font-bold text-lg">C</span>
        </div>
        {!collapsed && (
          <div className="animate-fade-up">
            <h1 className="font-bold text-foreground">City 2035</h1>
            <p className="text-xs text-muted-foreground">Citizen Dashboard</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive
                  ? emergencyMode
                    ? "bg-emergency/20 text-emergency glow-sm"
                    : "bg-primary/20 text-primary glow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive && "animate-pulse"
                )}
              />
              {!collapsed && (
                <span className="font-medium truncate animate-fade-up">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-glass-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
