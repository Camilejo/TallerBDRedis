import { IoTSensor } from "../../types"
import styles from "./SensorCard.module.css"

interface SensorCardProps {
  sensor: IoTSensor
  onClick: () => void
  isSelected: boolean
}

export default function SensorCard({
  sensor,
  onClick,
  isSelected,
}: SensorCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return "🟢"
      case "offline":
        return "🔴"
      case "maintenance":
        return "🟡"
      case "error":
        return "❌"
      default:
        return "⚪"
    }
  }

  const getBatteryIcon = (level: number) => {
    if (level > 75) return "🔋"
    if (level > 50) return "🔋"
    if (level > 25) return "🪫"
    return "🪫"
  }

  const getSignalIcon = (strength: number) => {
    if (strength > 75) return "📶"
    if (strength > 50) return "📶"
    if (strength > 25) return "📶"
    return "📶"
  }

  const formatTemperature = (temp: number) => {
    return `${temp.toFixed(1)}°C`
  }

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={styles.location}>
          <h3 className={styles.name}>{sensor.name}</h3>
          <p className={styles.city}>
            📍 {sensor.location.city}, {sensor.location.country}
          </p>
        </div>
        <div className={styles.status}>
          <span className={`${styles.statusBadge} ${styles[sensor.status]}`}>
            {getStatusIcon(sensor.status)} {sensor.status.toUpperCase()}
          </span>
        </div>
      </div>

      <div className={styles.readings}>
        <div className={styles.mainReading}>
          <span className={styles.temperature}>
            {formatTemperature(sensor.lastReading.temperature)}
          </span>
          <span className={styles.tempLabel}>Temperatura</span>
        </div>

        <div className={styles.subReadings}>
          <div className={styles.reading}>
            <span className={styles.value}>{sensor.lastReading.humidity}%</span>
            <span className={styles.label}>Humedad</span>
          </div>
          <div className={styles.reading}>
            <span className={styles.value}>{sensor.lastReading.pressure}</span>
            <span className={styles.label}>Presión</span>
          </div>
        </div>
      </div>

      <div className={styles.deviceInfo}>
        <div className={styles.infoItem}>
          <span className={styles.icon}>
            {getBatteryIcon(sensor.batteryLevel)}
          </span>
          <span className={styles.infoValue}>{sensor.batteryLevel}%</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.icon}>
            {getSignalIcon(sensor.signalStrength)}
          </span>
          <span className={styles.infoValue}>{sensor.signalStrength}%</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.icon}>⏱️</span>
          <span className={styles.infoValue}>
            {new Date(sensor.lastReading.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.zone}>{sensor.location.zone}</span>
        <span className={styles.region}>{sensor.location.region}</span>
      </div>
    </div>
  )
}
