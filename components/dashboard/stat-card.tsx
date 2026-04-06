"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"
import { useTheme } from "@/components/providers/theme-provider"

interface StatCardProps {
  title: string
  value: string | number
  unit?: string
  icon: LucideIcon
  trend?: "up" | "down" | "stable"
  trendValue?: string
  status?: "good" | "moderate" | "warning" | "danger"
  description?: string
}

const statusColors = {
  good: "text-success bg-success/20",
  moderate: "text-warning bg-warning/20",
  warning: "text-warning bg-warning/20",
  danger: "text-destructive bg-destructive/20",
}

export function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  status = "good",
  description,
}: StatCardProps) {
  const { emergencyMode } = useTheme()

  return (
    <GlassCard
      hover
      className={cn(
        "relative overflow-hidden group",
        emergencyMode && "border-emergency/30"
      )}
    >
      {/* Gradient Accent */}
      <div
        className={cn(
          "absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-40",
          status === "good" && "bg-success",
          status === "moderate" && "bg-warning",
          status === "warning" && "bg-warning",
          status === "danger" && "bg-destructive",
          emergencyMode && "bg-emergency"
        )}
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div
            className={cn(
              "p-2.5 rounded-xl",
              statusColors[status],
              emergencyMode && "bg-emergency/20 text-emergency"
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                trend === "up" && "text-success bg-success/20",
                trend === "down" && "text-destructive bg-destructive/20",
                trend === "stable" && "text-muted-foreground bg-secondary"
              )}
            >
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trend === "stable" && "→"}
              {trendValue}
            </div>
          )}
        </div>

        <h3 className="text-sm font-medium text-muted-foreground mb-1">
          {title}
        </h3>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
        </div>

        {description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </GlassCard>
  )
}
