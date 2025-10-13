import { Weather } from "../../hooks/useWeather"
import { formatTemperature } from "../../utils"
import styles from "./WeatherDetail.module.css"

type WeatherDetailProps = {
  weather: Weather
}

export default function WeatherDetail({ weather }: WeatherDetailProps) {
  const getWeatherIcon = (main: string) => {
    const icons: { [key: string]: string } = {
      Clear: "☀️",
      Clouds: "☁️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Thunderstorm: "⛈️",
      Snow: "❄️",
      Mist: "🌫️",
      Fog: "🌫️",
      Haze: "🌫️",
    }
    return icons[main] || "🌤️"
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.cityName}>Clima de: {weather.name}</h2>
      <div className={styles.weatherIcon}>
        {getWeatherIcon(weather.weather[0].main)}
      </div>
      <p className={styles.current}>{formatTemperature(weather.main.temp)}</p>
      <p className={styles.description}>{weather.weather[0].description}</p>

      <div className={styles.temperatures}>
        <div className={styles.temperatureCard}>
          <p>
            {formatTemperature(weather.main.temp_min)}
            <span>°C</span>
          </p>
          <span>Mínimo</span>
        </div>
        <div className={styles.temperatureCard}>
          <p>
            {formatTemperature(weather.main.temp_max)}
            <span>°C</span>
          </p>
          <span>Máximo</span>
        </div>
        <div className={styles.temperatureCard}>
          <p>
            {formatTemperature(weather.main.feels_like)}
            <span>°C</span>
          </p>
          <span>Sensación</span>
        </div>
      </div>

      <div className={styles.additionalInfo}>
        <div className={styles.infoItem}>
          <span className={styles.infoValue}>{weather.main.humidity}%</span>
          <span className={styles.infoLabel}>Humedad</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoValue}>{weather.wind.speed} m/s</span>
          <span className={styles.infoLabel}>Viento</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.infoValue}>{weather.main.pressure} hPa</span>
          <span className={styles.infoLabel}>Presión</span>
        </div>
      </div>
    </div>
  )
}
