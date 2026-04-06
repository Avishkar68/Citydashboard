"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"
import { Route, RouteStep } from "@/lib/mock-data"
import {
  Navigation,
  Car,
  Bus,
  Train,
  Footprints,
  Clock,
  MapPin,
  ChevronRight,
  CheckCircle2,
} from "lucide-react"

interface RouteStepsProps {
  route: Route | null
  travelMode: string
}

const modeIcons = {
  car: Car,
  bus: Bus,
  train: Train,
  walk: Footprints,
}

const modeColors = {
  car: "bg-chart-1/20 text-chart-1",
  bus: "bg-chart-2/20 text-chart-2",
  train: "bg-chart-3/20 text-chart-3",
  walk: "bg-chart-4/20 text-chart-4",
}

export function RouteSteps({ route, travelMode }: RouteStepsProps) {
  const { emergencyMode } = useTheme()
  const [activeStep, setActiveStep] = React.useState(0)

  // Simulate progress through steps
  React.useEffect(() => {
    if (!route) return

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= route.steps.length - 1) return 0
        return prev + 1
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [route])

  if (!route) {
    return (
      <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Navigation className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-semibold mb-2">No Route Selected</h3>
          <p className="text-sm text-muted-foreground">
            Enter your locations and search for routes to see step-by-step
            directions.
          </p>
        </div>
      </GlassCard>
    )
  }

  const DefaultIcon = modeIcons[travelMode as keyof typeof modeIcons] || Car

  return (
    <GlassCard className={cn("h-full", emergencyMode && "border-emergency/30")}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Navigation
            className={cn("w-4 h-4", emergencyMode && "text-emergency")}
          />
          Route Details
        </h3>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{route.duration} min</span>
        </div>
      </div>

      {/* Route Summary */}
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-lg mb-4",
          emergencyMode ? "bg-emergency/10" : "bg-secondary/50"
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2 rounded-lg",
              emergencyMode
                ? "bg-emergency/20 text-emergency"
                : "bg-primary/20 text-primary"
            )}
          >
            <DefaultIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-medium text-sm capitalize">{route.type} Route</p>
            <p className="text-xs text-muted-foreground">
              {route.distance} km • AQI {route.aqi}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium capitalize",
            route.traffic === "low" && "bg-success/20 text-success",
            route.traffic === "moderate" && "bg-warning/20 text-warning",
            route.traffic === "heavy" && "bg-destructive/20 text-destructive"
          )}
        >
          {route.traffic} traffic
        </div>
      </div>

      {/* Steps Timeline */}
      <div className="space-y-1 max-h-[350px] overflow-y-auto pr-2">
        {route.steps.map((step, index) => {
          const StepIcon =
            modeIcons[step.mode as keyof typeof modeIcons] || DefaultIcon
          const isActive = index === activeStep
          const isCompleted = index < activeStep

          return (
            <div
              key={index}
              className={cn(
                "flex gap-3 p-3 rounded-lg transition-all duration-300",
                isActive &&
                  (emergencyMode
                    ? "bg-emergency/10 border border-emergency/30"
                    : "bg-primary/10 border border-primary/30"),
                isCompleted && "opacity-60"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Indicator */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "p-2 rounded-full transition-all duration-300",
                    isActive &&
                      (emergencyMode
                        ? "bg-emergency/20 text-emergency scale-110"
                        : "bg-primary/20 text-primary scale-110"),
                    isCompleted && "bg-success/20 text-success",
                    !isActive &&
                      !isCompleted &&
                      (step.mode
                        ? modeColors[step.mode as keyof typeof modeColors]
                        : "bg-secondary text-muted-foreground")
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                {index < route.steps.length - 1 && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[20px] mt-1 transition-colors duration-300",
                      isCompleted ? "bg-success" : "bg-border"
                    )}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={cn(
                      "font-medium text-sm",
                      isActive && "text-foreground",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}
                  >
                    {step.instruction}
                  </p>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>{step.distance} km</span>
                  <span>•</span>
                  <span>{step.duration} min</span>
                  {step.stationName && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {step.stationName}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress Indicator */}
      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              emergencyMode ? "bg-emergency" : "bg-primary"
            )}
            style={{
              width: `${((activeStep + 1) / route.steps.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {activeStep + 1}/{route.steps.length}
        </span>
      </div>
    </GlassCard>
  )
}
