const API_KEY = "YOUR_API_KEY"

// Mumbai coords (you can later replace with user location)
const LAT = 19.0760
const LON = 72.8777

export const fetchAirQuality = async () => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`
  )
  const data = await res.json()

  const aqiMap: any = {
    1: { label: "Good", value: 50 },
    2: { label: "Moderate", value: 100 },
    3: { label: "Unhealthy for Sensitive Groups", value: 150 },
    4: { label: "Unhealthy", value: 200 },
    5: { label: "Hazardous", value: 300 },
  }

  const apiData = data.list[0]

  return {
    aqi: aqiMap[apiData.main.aqi].value,
    level: aqiMap[apiData.main.aqi].label,
    pm25: apiData.components.pm2_5,
    pm10: apiData.components.pm10,
    o3: apiData.components.o3,
    no2: apiData.components.no2,
    recommendation:
      apiData.main.aqi > 2
        ? "Limit outdoor exposure. Wear mask."
        : "Air quality is acceptable.",
  }
}

export const fetchWeather = async () => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${API_KEY}`
  )
  const data = await res.json()

  const conditionMap: any = {
    Clear: "sunny",
    Clouds: "cloudy",
    Rain: "rainy",
    Thunderstorm: "stormy",
  }

  return {
    temp: Math.round(data.main.temp),
    condition: conditionMap[data.weather[0].main] || "cloudy",
    humidity: data.main.humidity,
    wind: Math.round(data.wind.speed * 3.6), // m/s → km/h
    uvIndex: 5, // optional: use UV API later
    forecast: [],
  }
}