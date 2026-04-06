// City 2035 Smart City Dashboard - Mock Data

export interface AirQuality {
  aqi: number
  level: 'good' | 'moderate' | 'unhealthy' | 'hazardous'
  pm25: number
  pm10: number
  o3: number
  no2: number
  recommendation: string
}

export interface Weather {
  temp: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy'
  humidity: number
  wind: number
  uvIndex: number
  forecast: { day: string; temp: number; condition: string }[]
}

export interface TrafficStatus {
  level: 'low' | 'moderate' | 'heavy' | 'congested'
  avgSpeed: number
  incidents: number
  congestionAreas: string[]
}

export interface EnergyUsage {
  current: number
  daily: number
  monthly: number
  trend: 'up' | 'down' | 'stable'
  breakdown: { category: string; usage: number }[]
  hourlyData: { hour: string; usage: number }[]
}

export interface EVStation {
  id: string
  name: string
  distance: number
  available: number
  total: number
  type: 'fast' | 'standard'
  waitTime: number
}

export interface PetrolPump {
  id: string
  name: string
  distance: number
  petrolPrice: number
  dieselPrice: number
  waitTime: number
}

export interface Parking {
  id: string
  name: string
  distance: number
  available: number
  total: number
  hourlyRate: number
}

export interface Alert {
  id: string
  type: 'traffic' | 'weather' | 'safety' | 'utility' | 'air'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  time: string
}

export interface NearbyService {
  id: string
  type: 'hospital' | 'police' | 'fire' | 'ev' | 'petrol' | 'parking'
  name: string
  distance: number
  available: boolean
}

export interface Route {
  id: string
  type: 'fastest' | 'healthy' | 'emergency'
  duration: number
  distance: number
  traffic: 'low' | 'moderate' | 'heavy'
  aqi: number
  steps: RouteStep[]
  color: string
}

export interface RouteStep {
  instruction: string
  distance: number
  duration: number
  mode?: 'walk' | 'bus' | 'train' | 'car'
  stationName?: string
}

export interface CrimeAlert {
  id: string
  type: string
  location: string
  time: string
  severity: 'low' | 'medium' | 'high'
}

export interface UtilitySchedule {
  type: 'electricity' | 'water' | 'waste'
  nextDate: string
  frequency: string
  status: 'scheduled' | 'in-progress' | 'completed'
}

// Mock Data Generators

export const getAirQuality = (): AirQuality => ({
  aqi: 92,
  level: 'moderate',
  pm25: 42,
  pm10: 78,
  o3: 35,
  no2: 48,
  recommendation: 'Limit prolonged outdoor activity. Wear masks in high traffic areas like Bandra and Andheri.'
})
export const getWeather = (): Weather => ({
  temp: 31,
  condition: 'cloudy',
  humidity: 78,
  wind: 18,
  uvIndex: 7,
  forecast: [
    { day: 'Today', temp: 31, condition: 'Cloudy' },
    { day: 'Tomorrow', temp: 30, condition: 'Rainy' },
    { day: 'Wednesday', temp: 29, condition: 'Stormy' },
    { day: 'Thursday', temp: 32, condition: 'Sunny' },
    { day: 'Friday', temp: 33, condition: 'Sunny' }
  ]
})

export const getTrafficStatus = (): TrafficStatus => ({
  level: 'heavy',
  avgSpeed: 22,
  incidents: 7,
  congestionAreas: [
    'Bandra-Worli Sea Link',
    'Western Express Highway',
    'Andheri Junction',
    'Dadar Circle'
  ]
})

export const getEnergyUsage = (): EnergyUsage => ({
  current: 2.4,
  daily: 28.5,
  monthly: 856,
  trend: 'down',
  breakdown: [
    { category: 'HVAC', usage: 45 },
    { category: 'Lighting', usage: 20 },
    { category: 'Appliances', usage: 25 },
    { category: 'Other', usage: 10 }
  ],
  hourlyData: Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    usage: Math.random() * 3 + 1
  }))
})

export const getEVStations = (): EVStation[] => [
  { id: '1', name: 'Tata Power EV - BKC', distance: 2.1, available: 3, total: 10, type: 'fast', waitTime: 10, lat: 19.0607, lng: 72.8697 },
  { id: '2', name: 'Jio-BP Pulse - Andheri', distance: 5.8, available: 6, total: 12, type: 'fast', waitTime: 5, lat: 19.1197, lng: 72.8468 },
  { id: '3', name: 'ChargeZone - Lower Parel', distance: 6.2, available: 2, total: 8, type: 'standard', waitTime: 15, lat: 18.9988, lng: 72.8258 },
  { id: '4', name: 'Fort EV Hub', distance: 9.5, available: 4, total: 10, type: 'standard', waitTime: 0, lat: 18.9330, lng: 72.8347 }
]

export const getPetrolPumps = (): PetrolPump[] => [
  { id: '1', name: 'HP Petrol Pump - Bandra West', distance: 1.1, petrolPrice: 106.5, dieselPrice: 94.2, waitTime: 5, lat: 19.0495, lng: 72.8245 },
  { id: '2', name: 'Indian Oil - Santacruz', distance: 2.5, petrolPrice: 105.8, dieselPrice: 93.9, waitTime: 8, lat: 19.0810, lng: 72.8410 },
  { id: '3', name: 'Shell - Worli Sea Face', distance: 6.0, petrolPrice: 108.2, dieselPrice: 96.1, waitTime: 3, lat: 19.0176, lng: 72.8169 }
]

export const getParking = (): Parking[] => [
  { id: '1', name: 'BKC Multi-Level Parking', distance: 2.0, available: 35, total: 300, hourlyRate: 60, lat: 19.0606, lng: 72.8656 },
  { id: '2', name: 'Phoenix Mall Parking - Lower Parel', distance: 6.5, available: 120, total: 500, hourlyRate: 80, lat: 19.0176, lng: 72.8333 },
  { id: '3', name: 'Bandra Station Parking', distance: 1.5, available: 20, total: 100, hourlyRate: 40, lat: 19.0544, lng: 72.8406 },
  { id: '4', name: 'Colaba Public Parking', distance: 10.2, available: 10, total: 80, hourlyRate: 100, lat: 18.9067, lng: 72.8147 }
]

export const getAlerts = (): Alert[] => [
  {
    id: '1',
    type: 'traffic',
    severity: 'high',
    title: 'Heavy Traffic - WEH',
    description: 'Severe congestion on Western Express Highway near Andheri due to peak hour rush.',
    time: '5 min ago'
  },
  {
    id: '2',
    type: 'air',
    severity: 'medium',
    title: 'AQI Rising in Bandra',
    description: 'Air quality worsening due to traffic congestion and construction.',
    time: '20 min ago'
  },
  {
    id: '3',
    type: 'weather',
    severity: 'high',
    title: 'Heavy Rain Alert',
    description: 'Heavy rainfall expected in Mumbai suburbs between 3-7 PM.',
    time: '1 hour ago'
  },
  {
    id: '4',
    type: 'utility',
    severity: 'low',
    title: 'Water Cut Notice',
    description: 'Scheduled water supply cut in Bandra East tomorrow 2-5 AM.',
    time: '2 hours ago'
  }
]

export const getNearbyServices = (): NearbyService[] => [
  { id: '1', type: 'hospital', name: 'City General Hospital', distance: 1.2, available: true },
  { id: '2', type: 'police', name: 'Central Police Station', distance: 0.8, available: true },
  { id: '3', type: 'fire', name: 'Fire Station #3', distance: 1.5, available: true },
  { id: '4', type: 'ev', name: 'City Center Supercharger', distance: 0.5, available: true },
  { id: '5', type: 'petrol', name: 'Shell Station', distance: 0.8, available: true },
  { id: '6', type: 'parking', name: 'Central Garage', distance: 0.3, available: true }
]

export const getCrimeAlerts = (): CrimeAlert[] => [
  { id: '1', type: 'Mobile Snatching', location: 'Bandra Linking Road', time: '1 hour ago', severity: 'medium' },
  { id: '2', type: 'Chain Snatching', location: 'Dadar Station Area', time: '3 hours ago', severity: 'high' },
  { id: '3', type: 'Vehicle Theft', location: 'Andheri East', time: '6 hours ago', severity: 'medium' }
]

export const getUtilitySchedules = (): UtilitySchedule[] => [
  { type: 'waste', nextDate: 'Tomorrow, 8:00 AM', frequency: 'Daily', status: 'scheduled' },
  { type: 'water', nextDate: 'April 8, 2:00 AM', frequency: 'Weekly', status: 'scheduled' },
  { type: 'electricity', nextDate: 'No outage planned', frequency: 'As needed', status: 'completed' }
]

export const getRoutes = (mode: string, priority: string): Route[] => {
  const baseSteps: RouteStep[] = mode === 'car' ? [
    { instruction: 'Head north on Current Street', distance: 0.3, duration: 2 },
    { instruction: 'Turn right onto Main Avenue', distance: 1.2, duration: 5 },
    { instruction: 'Continue on Highway 101', distance: 3.5, duration: 8 },
    { instruction: 'Take exit 5 toward Downtown', distance: 0.8, duration: 3 },
    { instruction: 'Arrive at destination', distance: 0.2, duration: 1 }
  ] : mode === 'bus' ? [
    { instruction: 'Walk to Bus Stop A', distance: 0.2, duration: 3, mode: 'walk' },
    { instruction: 'Take Bus 42 (6 stops)', distance: 4.2, duration: 18, mode: 'bus', stationName: 'Central Station' },
    { instruction: 'Transfer at Tech Hub', distance: 0.1, duration: 5, mode: 'walk' },
    { instruction: 'Take Bus 15 (3 stops)', distance: 1.8, duration: 10, mode: 'bus', stationName: 'Downtown Terminal' },
    { instruction: 'Walk to destination', distance: 0.3, duration: 4, mode: 'walk' }
  ] : mode === 'train' ? [
    { instruction: 'Walk to Metro Station', distance: 0.4, duration: 5, mode: 'walk' },
    { instruction: 'Take Green Line (4 stations)', distance: 5.2, duration: 12, mode: 'train', stationName: 'Central Metro' },
    { instruction: 'Transfer to Blue Line', distance: 0.1, duration: 3, mode: 'walk' },
    { instruction: 'Take Blue Line (2 stations)', distance: 2.1, duration: 6, mode: 'train', stationName: 'Downtown Metro' },
    { instruction: 'Walk to destination', distance: 0.2, duration: 3, mode: 'walk' }
  ] : [
    { instruction: 'Head north on Current Street', distance: 0.3, duration: 4, mode: 'walk' },
    { instruction: 'Turn right onto Park Path', distance: 0.8, duration: 10, mode: 'walk' },
    { instruction: 'Continue through City Park', distance: 1.5, duration: 18, mode: 'walk' },
    { instruction: 'Cross at Main Street', distance: 0.3, duration: 4, mode: 'walk' },
    { instruction: 'Arrive at destination', distance: 0.1, duration: 2, mode: 'walk' }
  ]

  return [
    {
      id: '1',
      type: 'fastest',
      duration: priority === 'fastest' ? 18 : 22,
      distance: 5.8,
      traffic: 'moderate',
      aqi: 85,
      steps: baseSteps,
      color: '#3b82f6'
    },
    {
      id: '2',
      type: 'healthy',
      duration: priority === 'healthy' ? 24 : 28,
      distance: 6.5,
      traffic: 'low',
      aqi: 45,
      steps: baseSteps.map(s => ({ ...s, duration: s.duration + 2 })),
      color: '#22c55e'
    },
    {
      id: '3',
      type: 'emergency',
      duration: 12,
      distance: 5.2,
      traffic: 'low',
      aqi: 95,
      steps: baseSteps.map(s => ({ ...s, duration: Math.max(1, s.duration - 2) })),
      color: '#ef4444'
    }
  ]
}

export const getAISummary = (): string => {
  const summaries = [
    "Good morning! Today looks favorable for outdoor activities with moderate AQI (78) improving by afternoon. Traffic is light until 4 PM rush hour. Consider taking the Green Line for your commute - it's 15% faster today due to road construction on Main Street.",
    "Air quality is at moderate levels. Best time to exercise outdoors: before 10 AM or after 6 PM. Three EV charging stations have availability within 1km. Energy usage is 12% below your monthly average - great job!",
    "Traffic alert: Expect 20-minute delays on Highway 101 due to an earlier incident. Alternative route via Park Road saves 8 minutes. Weather is perfect for walking - UV index moderate until 2 PM."
  ]
  return summaries[Math.floor(Math.random() * summaries.length)]
}

export const getAQITrend = () => {
  return Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    aqi: Math.floor(Math.random() * 60) + 40,
    pm25: Math.floor(Math.random() * 30) + 15
  }))
}

export const getTrafficTrend = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    congestion: i >= 7 && i <= 9 ? 70 + Math.random() * 20 : 
               i >= 16 && i <= 19 ? 75 + Math.random() * 20 : 
               20 + Math.random() * 30
  }))
}

export const getChatResponses = (query: string): string => {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('travel') || lowerQuery.includes('best time')) {
    return "Based on current traffic patterns, the best time to travel today is between 10 AM - 3 PM or after 7 PM. Rush hour congestion is expected from 4-6 PM with 40% longer travel times."
  }
  if (lowerQuery.includes('safe') || lowerQuery.includes('go out')) {
    return "Current conditions are safe for outdoor activities. AQI is at moderate levels (78), and weather is clear. However, I recommend avoiding the Downtown area between 4-6 PM due to heavy traffic and slightly elevated pollution levels."
  }
  if (lowerQuery.includes('charge') || lowerQuery.includes('ev')) {
    return "The nearest available charging station is City Center Supercharger (0.5 km away) with 3 fast chargers available. Estimated wait time: 5 minutes. Pro tip: Tech Park Station has more availability if you can go 1.2 km."
  }
  if (lowerQuery.includes('weather') || lowerQuery.includes('rain')) {
    return "Current: Sunny, 24°C with 65% humidity. There's a 30% chance of thunderstorms between 4-8 PM. I recommend completing outdoor activities before 4 PM and carrying an umbrella if you'll be out later."
  }
  if (lowerQuery.includes('emergency') || lowerQuery.includes('hospital')) {
    return "EMERGENCY SERVICES NEARBY:\n• City General Hospital: 1.2 km (8 min drive)\n• Central Police Station: 0.8 km (6 min drive)\n• Fire Station #3: 1.5 km (10 min drive)\n\nDo you need me to activate emergency routing?"
  }
  
  return "I can help you with traffic conditions, air quality, weather, nearby services, route planning, and city alerts. What would you like to know about?"
}

export const getSavedRoutes = () => [
  { id: '1', name: 'Home to Office', from: '123 Residential St', to: 'Tech Park Building A', mode: 'car', frequency: 'Daily' },
  { id: '2', name: 'Weekend Gym', from: '123 Residential St', to: 'FitLife Gym Downtown', mode: 'walk', frequency: 'Sat, Sun' },
  { id: '3', name: 'Kids School', from: '123 Residential St', to: 'City Elementary School', mode: 'car', frequency: 'Weekdays' }
]

export const getTravelHistory = () => [
  { id: '1', from: 'Home', to: 'Office', date: 'Today, 8:30 AM', duration: '22 min', mode: 'car' },
  { id: '2', from: 'Office', to: 'Cafe Downtown', date: 'Today, 12:15 PM', duration: '8 min', mode: 'walk' },
  { id: '3', from: 'Home', to: 'City Mall', date: 'Yesterday, 2:00 PM', duration: '18 min', mode: 'bus' },
  { id: '4', from: 'Home', to: 'Central Park', date: 'Yesterday, 6:30 PM', duration: '12 min', mode: 'walk' }
]

export const getWaterUsage = () => ({
  current: 45,
  daily: 180,
  monthly: 5400,
  trend: 'stable' as const,
  breakdown: [
    { category: 'Bathroom', usage: 40 },
    { category: 'Kitchen', usage: 25 },
    { category: 'Laundry', usage: 20 },
    { category: 'Garden', usage: 15 }
  ]
})

export const getPollutionHeatmap = () => {
  const grid = []
  for (let i = 0; i < 8; i++) {
    const row = []
    for (let j = 0; j < 8; j++) {
      row.push({
        x: j,
        y: i,
        value: Math.floor(Math.random() * 100),
        area: `Zone ${String.fromCharCode(65 + i)}${j + 1}`
      })
    }
    grid.push(row)
  }
  return grid
}
