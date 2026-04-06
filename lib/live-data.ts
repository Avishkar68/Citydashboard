export const getWeather = async () => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&units=metric&appid=2f1af29c39db8695e57c50905337d550`
  )

  const data = await res.json()

  return {
    temp: Math.round(data.main.temp),
    humidity: data.main.humidity,
    condition: data.weather[0].main,
    wind: data.wind.speed,
  }
}

export const getAirQuality = async () => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/air_pollution?lat=19.0760&lon=72.8777&appid=2f1af29c39db8695e57c50905337d550`
  )

  const data = await res.json()

  const aqiMap = [0, 50, 100, 150, 200, 300]

  return {
    aqi: aqiMap[data.list[0].main.aqi],
    pm25: Math.round(data.list[0].components.pm2_5),
  }
}