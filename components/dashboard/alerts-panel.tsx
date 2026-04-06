"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { AlertTriangle, CloudRain, Car, Wrench, Wind, X } from "lucide-react"
import { getAlerts, Alert } from "@/lib/mock-data"
import { useTheme } from "@/components/providers/theme-provider"

const iconMap = {
  traffic: Car,
  weather: CloudRain,
  safety: AlertTriangle,
  utility: Wrench,
  air: Wind,
}

const severityStyles = {
  low: "border-border bg-secondary/30",
  medium: "border-primary/30 bg-primary/5",
  high: "border-warning/30 bg-warning/5",
  critical: "border-destructive/30 bg-destructive/5",
}

export function AlertsPanel() {
  const { emergencyMode } = useTheme()
  const [alerts, setAlerts] = React.useState<Alert[]>([])
  const [dismissed, setDismissed] = React.useState<Set<string>>(new Set())

  React.useEffect(() => {
    setAlerts(getAlerts())
  }, [])

  const visibleAlerts = alerts.filter((a) => !dismissed.has(a.id))

  const dismissAlert = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]))
  }

  if (visibleAlerts.length === 0) {
    return null
  }

  return (
    <GlassCard className={cn(
      "mb-6",
      emergencyMode && "border-emergency/30"
    )}>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <AlertTriangle className={cn(
          "w-4 h-4",
          emergencyMode ? "text-emergency" : "text-warning"
        )} />
        Active Alerts
      </h3>

      <div className="space-y-2">
        {visibleAlerts.map((alert, index) => {
          const Icon = iconMap[alert.type]
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border transition-all duration-300 animate-slide-in",
                severityStyles[alert.severity],
                emergencyMode && alert.severity === 'high' && "border-emergency/50 bg-emergency/10"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon
                className={cn(
                  "w-5 h-5 shrink-0 mt-0.5",
                  alert.severity === "critical" && "text-destructive",
                  alert.severity === "high" && "text-warning",
                  alert.severity === "medium" && "text-primary",
                  alert.severity === "low" && "text-muted-foreground"
                )}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-sm">{alert.title}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {alert.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {alert.description}
                </p>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 rounded-lg hover:bg-secondary transition-colors shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}
