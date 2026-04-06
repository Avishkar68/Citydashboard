"use client"

import * as React from "react"
import { Bell, Sun, Moon, AlertTriangle, User, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { useTheme } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"
import { getAISummary, getAlerts } from "@/lib/mock-data"

export function Header() {
  const { theme, setTheme, emergencyMode, setEmergencyMode } = useTheme()
  const [showAlerts, setShowAlerts] = React.useState(false)
  const [aiSummary, setAiSummary] = React.useState("")
  const alerts = getAlerts()

  React.useEffect(() => {
    setAiSummary(getAISummary())
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-40 glass-strong border-b border-glass-border p-4",
      emergencyMode && "border-emergency/50 bg-emergency/5"
    )}>
      <div className="flex items-center justify-between gap-4">
        {/* AI Summary */}
        <div className="flex-1 min-w-0">
          <GlassCard className={cn(
            "flex items-start gap-3 py-3",
            emergencyMode && "border-emergency/30"
          )}>
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              emergencyMode ? "bg-emergency/20" : "bg-primary/20"
            )}>
              <Sparkles className={cn(
                "w-5 h-5",
                emergencyMode ? "text-emergency" : "text-primary"
              )} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                AI Daily Summary
              </p>
              <p className="text-sm text-foreground leading-relaxed line-clamp-2">
                {aiSummary || "Loading your personalized summary..."}
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Emergency Mode Toggle */}
          <Button
            variant={emergencyMode ? "destructive" : "outline"}
            size="sm"
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={cn(
              "gap-2 transition-all duration-300",
              emergencyMode && "animate-pulse-glow"
            )}
          >
            <AlertTriangle className="w-4 h-4" />
            <span className="hidden sm:inline">
              {emergencyMode ? "Exit Emergency" : "Emergency"}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="shrink-0"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowAlerts(!showAlerts)}
              className="shrink-0 relative"
            >
              <Bell className="w-4 h-4" />
              {alerts.filter(a => a.severity === 'high' || a.severity === 'critical').length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
              )}
            </Button>

            {/* Alerts Dropdown */}
            {showAlerts && (
              <GlassCard className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 animate-fade-up">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Alerts
                </h3>
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={cn(
                        "p-3 rounded-lg border",
                        alert.severity === 'critical' && "bg-destructive/10 border-destructive/30",
                        alert.severity === 'high' && "bg-warning/10 border-warning/30",
                        alert.severity === 'medium' && "bg-primary/10 border-primary/30",
                        alert.severity === 'low' && "bg-secondary border-border"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{alert.title}</span>
                        <span className="text-xs text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </div>

          {/* User */}
          <Button variant="outline" size="icon" className="shrink-0">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
