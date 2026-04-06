"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"
import { AlertTriangle, Phone, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"

export function PanicButton() {
  const { emergencyMode, setEmergencyMode } = useTheme()
  const [showEmergencyPanel, setShowEmergencyPanel] = React.useState(false)
  const [countdown, setCountdown] = React.useState<number | null>(null)

  // Countdown when emergency is triggered
  React.useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      // Trigger emergency
      setEmergencyMode(true)
      setShowEmergencyPanel(true)
      setCountdown(null)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, setEmergencyMode])

  const triggerEmergency = () => {
    setCountdown(3)
  }

  const cancelEmergency = () => {
    setCountdown(null)
  }

  if (!emergencyMode) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {countdown !== null ? (
          <div className="flex items-center gap-3 animate-fade-up">
            <Button
              variant="outline"
              size="sm"
              onClick={cancelEmergency}
              className="bg-background"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <div className="relative">
              <button
                className="w-20 h-20 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center animate-pulse-glow shadow-2xl"
                disabled
              >
                <span className="text-3xl font-bold">{countdown}</span>
              </button>
              <div className="absolute inset-0 rounded-full border-4 border-destructive animate-ping" />
            </div>
          </div>
        ) : (
          <button
            onClick={triggerEmergency}
            className="w-16 h-16 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 group"
          >
            <AlertTriangle className="w-7 h-7 group-hover:animate-pulse" />
          </button>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Emergency Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-emergency/10 pointer-events-none z-40 transition-opacity duration-500",
          emergencyMode ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="absolute inset-0 border-8 border-emergency/30 animate-pulse" />
      </div>

      {/* Emergency Panel */}
      {showEmergencyPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <GlassCard className="w-full max-w-md border-emergency/50 animate-fade-up">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emergency/20 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-10 h-10 text-emergency" />
              </div>
              <h2 className="text-2xl font-bold text-emergency mb-2">
                Emergency Mode Active
              </h2>
              <p className="text-muted-foreground mb-6">
                Emergency services have been notified. The map now shows the
                fastest routes to nearby hospitals and police stations.
              </p>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/30 hover:bg-destructive/20 transition-colors">
                  <Phone className="w-5 h-5 text-destructive" />
                  <span className="font-medium text-destructive">Call 911</span>
                </button>
                <button className="flex items-center justify-center gap-2 p-4 rounded-lg bg-chart-3/10 border border-chart-3/30 hover:bg-chart-3/20 transition-colors">
                  <Phone className="w-5 h-5 text-chart-3" />
                  <span className="font-medium text-chart-3">Police</span>
                </button>
              </div>

              {/* Emergency Contacts */}
              <div className="text-left space-y-2 mb-6 p-4 rounded-lg bg-secondary/30">
                <h4 className="font-semibold text-sm mb-2">
                  Nearest Emergency Services
                </h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">City General Hospital</span>
                  <span className="font-medium">1.2 km • 8 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Central Police Station</span>
                  <span className="font-medium">0.8 km • 6 min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fire Station #3</span>
                  <span className="font-medium">1.5 km • 10 min</span>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowEmergencyPanel(false)}
                >
                  View Map
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => {
                    setEmergencyMode(false)
                    setShowEmergencyPanel(false)
                  }}
                >
                  Exit Emergency Mode
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Floating Emergency Exit Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowEmergencyPanel(true)}
          className="bg-background border-emergency/50 text-emergency"
        >
          Emergency Panel
        </Button>
        <button
          onClick={() => setEmergencyMode(false)}
          className="w-16 h-16 rounded-full bg-emergency text-white flex items-center justify-center shadow-xl animate-pulse-glow"
        >
          <X className="w-7 h-7" />
        </button>
      </div>
    </>
  )
}
