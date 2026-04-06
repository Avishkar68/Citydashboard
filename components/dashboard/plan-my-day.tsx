"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { Sparkles, Clock, Sun, Cloud, Umbrella, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/providers/theme-provider"

interface PlanItem {
  time: string
  activity: string
  recommendation: string
  icon: React.ElementType
  weather?: string
}

const generatePlan = (): PlanItem[] => [
  {
    time: "7:00 AM",
    activity: "Morning Commute",
    recommendation: "Traffic is light. Take Highway 101 for fastest route (22 min).",
    icon: Clock,
    weather: "Clear, 18°C",
  },
  {
    time: "12:00 PM",
    activity: "Lunch Break",
    recommendation: "AQI is moderate. Indoor dining recommended at Tech Park Café.",
    icon: Sun,
    weather: "Sunny, 24°C",
  },
  {
    time: "3:00 PM",
    activity: "Outdoor Meeting",
    recommendation: "Good conditions until 4 PM. UV index 6 - consider shade.",
    icon: Cloud,
    weather: "Partly cloudy, 26°C",
  },
  {
    time: "5:30 PM",
    activity: "Evening Commute",
    recommendation: "Expect 30% delays. Leave at 5:45 PM for better traffic.",
    icon: Umbrella,
    weather: "30% rain chance",
  },
]

export function PlanMyDay() {
  const { emergencyMode } = useTheme()
  const [isPlanning, setIsPlanning] = React.useState(false)
  const [plan, setPlan] = React.useState<PlanItem[] | null>(null)
  const [showPlan, setShowPlan] = React.useState(false)

  const handlePlanMyDay = () => {
    setIsPlanning(true)
    // Simulate AI processing
    setTimeout(() => {
      setPlan(generatePlan())
      setIsPlanning(false)
      setShowPlan(true)
    }, 1500)
  }

  return (
    <GlassCard className={cn(
      emergencyMode && "border-emergency/30"
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className={cn(
            "w-4 h-4",
            emergencyMode ? "text-emergency" : "text-primary"
          )} />
          Plan My Day
        </h3>
        {plan && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPlan(!showPlan)}
            className="text-xs"
          >
            {showPlan ? "Hide" : "Show"} Plan
          </Button>
        )}
      </div>

      {!plan ? (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground mb-4">
            Let AI analyze traffic, weather, and air quality to optimize your day.
          </p>
          <Button
            onClick={handlePlanMyDay}
            disabled={isPlanning}
            className={cn(
              "gap-2",
              emergencyMode && "bg-emergency hover:bg-emergency/90"
            )}
          >
            {isPlanning ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Plan
              </>
            )}
          </Button>
        </div>
      ) : (
        showPlan && (
          <div className="space-y-3">
            {plan.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  key={index}
                  className="flex gap-3 p-3 rounded-lg bg-secondary/30 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-lg bg-primary/20 text-primary">
                      <Icon className="w-4 h-4" />
                    </div>
                    {index < plan.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">{item.time}</span>
                      {item.weather && (
                        <span className="text-xs text-muted-foreground">
                          {item.weather}
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {item.activity}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.recommendation}
                    </p>
                  </div>
                </div>
              )
            })}

            <div className="flex items-center gap-2 text-success text-sm pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Plan optimized for your preferences</span>
            </div>
          </div>
        )
      )}
    </GlassCard>
  )
}
