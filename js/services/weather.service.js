export const weatherService = {
  getWeather,
}

function getWeather(coords, location) {
  const API_KEY = 'c3971172dea995b33f8147ac6ebcaae3'
  let prmRes = axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lng}&units=metric&APPID=${API_KEY}`
  )
  const prmData = prmRes.then((res) => {
    const locationName = location
    const mainWeather = res.data.weather[0].main
    const desc = res.data.weather[0].description
    const currentTemp = res.data.main.temp + ' °C'
    const maxTemp = res.data.main.temp_max + ' °C'
    const minTemp = res.data.main.temp_min + ' °C'
    var icon = res.data.weather[0].icon
    var wind = res.data.wind.speed + ' m/s'
    console.log(icon)
    return {
      locationName,
      mainWeather,
      desc,
      currentTemp,
      maxTemp,
      minTemp,
      icon,
      wind,
    }
  })
  return prmData
}
