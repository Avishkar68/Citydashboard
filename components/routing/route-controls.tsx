"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"
import {
  MapPin,
  Navigation,
  Car,
  Bus,
  Train,
  Footprints,
  Zap,
  Heart,
  Scale,
  Search,
} from "lucide-react"

interface RouteControlsProps {
  fromLocation: string
  toLocation: string
  travelMode: string
  priority: string
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onModeChange: (mode: string) => void
  onPriorityChange: (priority: string) => void
  onSearch: () => void
  isSearching: boolean
}

const travelModes = [
  { id: "car", icon: Car, label: "Car" },
  { id: "bus", icon: Bus, label: "Bus" },
  { id: "train", icon: Train, label: "Train" },
  { id: "walk", icon: Footprints, label: "Walk" },
]

const priorities = [
  { id: "fastest", icon: Zap, label: "Fastest" },
  { id: "healthy", icon: Heart, label: "Healthiest" },
  { id: "balanced", icon: Scale, label: "Balanced" },
]

const suggestedLocations = [
  "123 Residential Street",
  "Tech Park Building A",
  "City Center Mall",
  "Downtown Station",
  "City General Hospital",
  "Central Park",
]

export function RouteControls({
  fromLocation,
  toLocation,
  travelMode,
  priority,
  onFromChange,
  onToChange,
  onModeChange,
  onPriorityChange,
  onSearch,
  isSearching,
}: RouteControlsProps) {
  const { emergencyMode } = useTheme()
  const [showFromSuggestions, setShowFromSuggestions] = React.useState(false)
  const [showToSuggestions, setShowToSuggestions] = React.useState(false)

  return (
    <GlassCard
      className={cn("space-y-4", emergencyMode && "border-emergency/30")}
    >
      <h3 className="font-semibold flex items-center gap-2">
        <Navigation
          className={cn("w-4 h-4", emergencyMode && "text-emergency")}
        />
        Route Planner
      </h3>

      {/* Location Inputs */}
      <div className="space-y-3">
        {/* From Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
          <input
            type="text"
            placeholder="From location..."
            value={fromLocation}
            onChange={(e) => onFromChange(e.target.value)}
            onFocus={() => setShowFromSuggestions(true)}
            onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
            className={cn(
              "w-full pl-8 pr-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
              emergencyMode && "focus:ring-emergency/50"
            )}
          />
          {showFromSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 glass rounded-lg overflow-hidden z-10 animate-fade-up">
              {suggestedLocations.map((loc) => (
                <button
                  key={loc}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/50 transition-colors"
                  onClick={() => {
                    onFromChange(loc)
                    setShowFromSuggestions(false)
                  }}
                >
                  <MapPin className="w-3 h-3 inline mr-2 text-muted-foreground" />
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connector Line */}
        <div className="flex items-center gap-2 px-3">
          <div className="w-0.5 h-8 bg-border ml-[3px]" />
        </div>

        {/* To Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-accent" />
          <input
            type="text"
            placeholder="To location..."
            value={toLocation}
            onChange={(e) => onToChange(e.target.value)}
            onFocus={() => setShowToSuggestions(true)}
            onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
            className={cn(
              "w-full pl-8 pr-4 py-3 rounded-lg bg-secondary/50 border border-border text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
              emergencyMode && "focus:ring-emergency/50"
            )}
          />
          {showToSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 glass rounded-lg overflow-hidden z-10 animate-fade-up">
              {suggestedLocations.map((loc) => (
                <button
                  key={loc}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/50 transition-colors"
                  onClick={() => {
                    onToChange(loc)
                    setShowToSuggestions(false)
                  }}
                >
                  <MapPin className="w-3 h-3 inline mr-2 text-muted-foreground" />
                  {loc}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Travel Mode Selection */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Travel Mode</p>
        <div className="grid grid-cols-4 gap-2">
          {travelModes.map((mode) => {
            const Icon = mode.icon
            return (
              <button
                key={mode.id}
                onClick={() => onModeChange(mode.id)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-200",
                  travelMode === mode.id
                    ? emergencyMode
                      ? "bg-emergency/20 text-emergency border border-emergency/30"
                      : "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary border border-transparent"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{mode.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Priority Selection */}
      <div>
        <p className="text-xs text-muted-foreground mb-2">Route Priority</p>
        <div className="grid grid-cols-3 gap-2">
          {priorities.map((p) => {
            const Icon = p.icon
            return (
              <button
                key={p.id}
                onClick={() => onPriorityChange(p.id)}
                className={cn(
                  "flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-200",
                  priority === p.id
                    ? emergencyMode
                      ? "bg-emergency/20 text-emergency border border-emergency/30"
                      : "bg-primary/20 text-primary border border-primary/30"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary border border-transparent"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{p.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Search Button */}
      <Button
        onClick={onSearch}
        disabled={isSearching || !fromLocation || !toLocation}
        className={cn(
          "w-full gap-2",
          emergencyMode && "bg-emergency hover:bg-emergency/90"
        )}
      >
        {isSearching ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Finding Routes...
          </>
        ) : (
          <>
            <Search className="w-4 h-4" />
            Find Routes
          </>
        )}
      </Button>
    </GlassCard>
  )
}
