"use client"

import * as React from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/providers/theme-provider"
import {
  Shield,
  AlertTriangle,
  Phone,
  Hospital,
  Siren,
  Flame,
  MapPin,
  Clock,
  Bell,
  Navigation,
  Eye,
} from "lucide-react"
import {
  getCrimeAlerts,
  getNearbyServices,
  CrimeAlert,
  NearbyService,
} from "@/lib/mock-data"

export default function SafetyPage() {
  const { emergencyMode, setEmergencyMode } = useTheme()
  const [crimeAlerts, setCrimeAlerts] = React.useState<CrimeAlert[]>([])
  const [services, setServices] = React.useState<NearbyService[]>([])
  const [liveAlerts, setLiveAlerts] = React.useState<string[]>([])

  React.useEffect(() => {
    setCrimeAlerts(getCrimeAlerts())
    setServices(getNearbyServices().filter(s => 
      ['hospital', 'police', 'fire'].includes(s.type)
    ))

    // Simulate live alert feed
    const alertMessages = [
      "Traffic incident cleared on Highway 101",
      "Weather advisory: Light rain expected in 2 hours",
      "All clear in Downtown area",
      "Routine patrol in Tech Park district",
      "Emergency services responding to medical call",
    ]
    
    setLiveAlerts(alertMessages.slice(0, 3))
    
    const interval = setInterval(() => {
      const randomAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)]
      setLiveAlerts(prev => [randomAlert, ...prev.slice(0, 4)])
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const emergencyContacts = [
    { name: "Emergency (911)", number: "911", icon: Siren, color: "text-destructive bg-destructive/20" },
    { name: "Police Non-Emergency", number: "555-0123", icon: Shield, color: "text-chart-3 bg-chart-3/20" },
    { name: "Fire Department", number: "555-0124", icon: Flame, color: "text-warning bg-warning/20" },
    { name: "Ambulance", number: "555-0125", icon: Hospital, color: "text-primary bg-primary/20" },
  ]

  const severityColors = {
    low: "border-success/30 bg-success/5",
    medium: "border-warning/30 bg-warning/5",
    high: "border-destructive/30 bg-destructive/5",
  }

  const serviceIcons = {
    hospital: Hospital,
    police: Shield,
    fire: Flame,
  }

  const serviceColors = {
    hospital: "text-destructive bg-destructive/20",
    police: "text-chart-3 bg-chart-3/20",
    fire: "text-warning bg-warning/20",
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className={cn(
              "w-6 h-6",
              emergencyMode ? "text-emergency" : "text-chart-3"
            )} />
            Safety Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Emergency contacts, crime alerts, and nearby safety services
          </p>
        </div>
        <Button
          variant={emergencyMode ? "destructive" : "outline"}
          onClick={() => setEmergencyMode(!emergencyMode)}
          className={cn(
            "gap-2",
            emergencyMode && "animate-pulse"
          )}
        >
          <AlertTriangle className="w-4 h-4" />
          {emergencyMode ? "Exit Emergency Mode" : "Emergency Mode"}
        </Button>
      </div>

      {/* Emergency Contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {emergencyContacts.map((contact) => {
          const Icon = contact.icon
          return (
            <GlassCard
              key={contact.name}
              hover
              className={cn(
                "cursor-pointer group",
                emergencyMode && "border-emergency/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("p-3 rounded-lg", contact.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{contact.name}</p>
                  <p className="text-lg font-bold group-hover:text-primary transition-colors">
                    {contact.number}
                  </p>
                </div>
                <Phone className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </GlassCard>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Crime Alerts */}
        <GlassCard className={cn("lg:col-span-2", emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className={cn(
              "w-4 h-4",
              emergencyMode ? "text-emergency" : "text-warning"
            )} />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {crimeAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border animate-fade-up",
                  severityColors[alert.severity],
                  emergencyMode && alert.severity === 'high' && "border-emergency/50 bg-emergency/10"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                        alert.severity === 'low' && "bg-success/20 text-success",
                        alert.severity === 'medium' && "bg-warning/20 text-warning",
                        alert.severity === 'high' && "bg-destructive/20 text-destructive"
                      )}>
                        {alert.severity}
                      </span>
                      <span className="text-sm font-medium">{alert.type}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {alert.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Live Alert Feed */}
        <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Bell className={cn(
              "w-4 h-4 animate-pulse",
              emergencyMode && "text-emergency"
            )} />
            Live Feed
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {liveAlerts.map((alert, index) => (
              <div
                key={`${alert}-${index}`}
                className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 animate-slide-in"
              >
                <div className="w-2 h-2 rounded-full bg-success mt-2 animate-pulse" />
                <div>
                  <p className="text-sm">{alert}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {index === 0 ? 'Just now' : `${index * 3} min ago`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Nearby Emergency Services */}
      <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Hospital className={cn(
            "w-4 h-4",
            emergencyMode && "text-emergency"
          )} />
          Nearby Emergency Services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.type as keyof typeof serviceIcons]
            const colorClass = serviceColors[service.type as keyof typeof serviceColors]
            return (
              <div
                key={service.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg bg-secondary/30 animate-fade-up",
                  emergencyMode && "border border-emergency/30"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={cn("p-3 rounded-lg", colorClass)}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{service.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.distance} km away
                  </p>
                </div>
                <Button size="sm" className="gap-1 shrink-0">
                  <Navigation className="w-4 h-4" />
                  Go
                </Button>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Safety Tips */}
      <GlassCard className={cn(emergencyMode && "border-emergency/30")}>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Safety Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Stay Alert",
              description: "Be aware of your surroundings, especially in unfamiliar areas.",
            },
            {
              title: "Share Location",
              description: "Let someone know your whereabouts when traveling alone.",
            },
            {
              title: "Emergency Kit",
              description: "Keep a basic emergency kit in your vehicle at all times.",
            },
            {
              title: "Report Suspicious Activity",
              description: "If you see something, say something. Report to local authorities.",
            },
          ].map((tip, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-secondary/30 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h4 className="font-medium mb-2">{tip.title}</h4>
              <p className="text-sm text-muted-foreground">{tip.description}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
