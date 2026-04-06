"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"
import {
  Car,
  Fuel,
  ParkingCircle,
  Zap,
  Clock,
  MapPin,
  Navigation,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
} from "lucide-react"
import {
  getEVStations,
  getPetrolPumps,
  getParking,
  getTrafficStatus,
  EVStation,
  PetrolPump,
  Parking,
} from "@/lib/mock-data"

export default function MobilityPage() {
  const { emergencyMode } = useTheme()
  const [evStations, setEvStations] = React.useState<EVStation[]>([])
  const [petrolPumps, setPetrolPumps] = React.useState<PetrolPump[]>([])
  const [parking, setParking] = React.useState<Parking[]>([])
  const [traffic, setTraffic] = React.useState(getTrafficStatus())
  const [activeTab, setActiveTab] = React.useState<"ev" | "petrol" | "parking">("ev")

  React.useEffect(() => {
    setEvStations(getEVStations())
    setPetrolPumps(getPetrolPumps())
    setParking(getParking())
  }, [])
  const openGoogleMaps = (lat: number, lng: number) => {
    const origin = "19.0425,72.8193" // Bandra Fort
    const destination = `${lat},${lng}`

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`

    window.open(url, "_blank")
  }
  const trafficLevelColor = {
    low: "text-success bg-success/20",
    moderate: "text-warning bg-warning/20",
    heavy: "text-destructive bg-destructive/20",
    congested: "text-destructive bg-destructive/20",
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Car className={cn(
            "w-6 h-6",
            emergencyMode ? "text-emergency" : "text-primary"
          )} />
          Mobility Hub
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real-time traffic, EV charging, fuel stations, and parking availability
        </p>
      </div>

      {/* Traffic Overview */}
      <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className={cn(
            "w-4 h-4",
            traffic.level === 'low' ? "text-success" :
              traffic.level === 'moderate' ? "text-warning" : "text-destructive"
          )} />
          Traffic Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-1">Current Status</p>
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-2 py-1 rounded-full text-sm font-medium capitalize",
                trafficLevelColor[traffic.level]
              )}>
                {traffic.level}
              </span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-1">Average Speed</p>
            <p className="text-2xl font-bold">{traffic.avgSpeed} <span className="text-sm font-normal text-muted-foreground">km/h</span></p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-1">Active Incidents</p>
            <p className="text-2xl font-bold">{traffic.incidents}</p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30">
            <p className="text-sm text-muted-foreground mb-1">Congestion Areas</p>
            <p className="text-sm font-medium truncate">{traffic.congestionAreas[0]}</p>
          </div>
        </div>
      </GlassCard>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === "ev" ? "default" : "outline"}
          onClick={() => setActiveTab("ev")}
          className="gap-2"
        >
          <Zap className="w-4 h-4" />
          EV Charging
        </Button>
        <Button
          variant={activeTab === "petrol" ? "default" : "outline"}
          onClick={() => setActiveTab("petrol")}
          className="gap-2"
        >
          <Fuel className="w-4 h-4" />
          Fuel Stations
        </Button>
        <Button
          variant={activeTab === "parking" ? "default" : "outline"}
          onClick={() => setActiveTab("parking")}
          className="gap-2"
        >
          <ParkingCircle className="w-4 h-4" />
          Parking
        </Button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "ev" && evStations.map((station, index) => (
          <GlassCard
            key={station.id}
            hover
            className={cn(
              "animate-fade-up",
              emergencyMode && "border-emergency/30"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                station.available > 0 ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              )}>
                <Zap className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-xs font-medium px-2 py-1 rounded-full",
                station.type === 'fast' ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
              )}>
                {station.type === 'fast' ? 'Fast Charger' : 'Standard'}
              </span>
            </div>
            <h4 className="font-semibold mb-1">{station.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Distance
                </span>
                <span className="font-medium">{station.distance} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className={cn(
                  "font-medium",
                  station.available > 0 ? "text-success" : "text-destructive"
                )}>
                  {station.available}/{station.total} slots
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Wait Time
                </span>
                <span className="font-medium">
                  {station.waitTime === 0 ? 'No wait' : `~${station.waitTime} min`}
                </span>
              </div>
            </div>
            <Button
              className="w-full mt-4 gap-2"
              size="sm"
              onClick={() => openGoogleMaps(station.lat, station.lng)}
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Button>
          </GlassCard>
        ))}

        {activeTab === "petrol" && petrolPumps.map((pump, index) => (
          <GlassCard
            key={pump.id}
            hover
            className={cn(
              "animate-fade-up",
              emergencyMode && "border-emergency/30"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-warning/20 text-warning">
                <Fuel className="w-5 h-5" />
              </div>
              {pump.waitTime === 0 ? (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-success/20 text-success">
                  No Wait
                </span>
              ) : (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-warning/20 text-warning">
                  {pump.waitTime} min wait
                </span>
              )}
            </div>
            <h4 className="font-semibold mb-1">{pump.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Distance
                </span>
                <span className="font-medium">{pump.distance} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Petrol Price</span>
                <span className="font-medium text-success">${pump.petrolPrice}/L</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Diesel Price</span>
                <span className="font-medium">${pump.dieselPrice}/L</span>
              </div>
            </div>
            <Button
              className="w-full mt-4 gap-2"
              size="sm"
              onClick={() => openGoogleMaps(pump.lat, pump.lng)}
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Button>
          </GlassCard>
        ))}

        {activeTab === "parking" && parking.map((lot, index) => (
          <GlassCard
            key={lot.id}
            hover
            className={cn(
              "animate-fade-up",
              emergencyMode && "border-emergency/30"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className={cn(
                "p-2 rounded-lg",
                lot.available > 20 ? "bg-success/20 text-success" :
                  lot.available > 5 ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"
              )}>
                <ParkingCircle className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-secondary text-muted-foreground">
                ${lot.hourlyRate}/hr
              </span>
            </div>
            <h4 className="font-semibold mb-1">{lot.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  Distance
                </span>
                <span className="font-medium">{lot.distance} km</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Availability</span>
                <span className={cn(
                  "font-medium",
                  lot.available > 20 ? "text-success" :
                    lot.available > 5 ? "text-warning" : "text-destructive"
                )}>
                  {lot.available}/{lot.total} spots
                </span>
              </div>
              {/* Availability Bar */}
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    lot.available > 20 ? "bg-success" :
                      lot.available > 5 ? "bg-warning" : "bg-destructive"
                  )}
                  style={{ width: `${(lot.available / lot.total) * 100}%` }}
                />
              </div>
            </div>
            <Button
              className="w-full mt-4 gap-2"
              size="sm"
              onClick={() => openGoogleMaps(lot.lat, lot.lng)}
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </Button>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
