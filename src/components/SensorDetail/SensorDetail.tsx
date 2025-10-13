import { IoTSensor, SensorHistory } from "../../types"
import styles from "./SensorDetail.module.css"

interface SensorDetailProps {
  sensor: IoTSensor
  history: SensorHistory | null
  onClose: () => void
  isModal?: boolean
}

export default function SensorDetail({
  sensor,
  history,
  onClose,
  isModal = false,
}: SensorDetailProps) {
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "rising":
        return "📈"
      case "falling":
        return "📉"
      case "stable":
        return "➡️"
      default:
        return "➡️"
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getBatteryIcon = (level: number) => {
    if (level > 75) return "🔋"
    if (level > 50) return "🔋"
    if (level > 25) return "🪫"
    if (level > 10) return "🪫"
    return "🔋"
  }

  const getSignalIcon = (strength: number) => {
    if (strength > 80) return "📶"
    if (strength > 60) return "📶"
    if (strength > 40) return "📶"
    if (strength > 20) return "📵"
    return "📵"
  }

  const getTrendColor = (trend: "rising" | "falling" | "stable") => {
    switch (trend) {
      case "rising":
        return styles.trendRising
      case "falling":
        return styles.trendFalling
      case "stable":
        return styles.trendStable
      default:
        return ""
    }
  }

  if (isModal) {
    return (
      <>
        <div className={styles.overlay} onClick={onClose}></div>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <div className={styles.sensorInfo}>
              <h2 className={styles.sensorName}>{sensor.name}</h2>
              <div className={styles.location}>
                📍 {sensor.location.city}, {sensor.location.country}
              </div>
              <div className={`${styles.status} ${styles[sensor.status]}`}>
                {getStatusIcon(sensor.status)} {sensor.status.toUpperCase()}
              </div>
            </div>
            <button onClick={onClose} className={styles.closeButton}>
              ✕
            </button>
          </div>

          <div className={styles.modalContent}>
            {/* Información del Dispositivo */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                📱 Información del Dispositivo
              </h3>
              <div className={styles.grid}>
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>ID del Sensor</div>
                  <div className={styles.infoValue}>{sensor.id}</div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Firmware</div>
                  <div className={styles.infoValue}>{sensor.firmware}</div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Región</div>
                  <div className={styles.infoValue}>
                    {sensor.location.region.toUpperCase()}
                  </div>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.infoLabel}>Zona</div>
                  <div className={styles.infoValue}>
                    {sensor.location.zone.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>

            {/* Estado del Sistema */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>⚡ Estado del Sistema</h3>
              <div className={styles.statusGrid}>
                <div className={styles.statusCard}>
                  <div className={styles.statusIcon}>
                    {getBatteryIcon(sensor.batteryLevel)}
                  </div>
                  <div className={styles.statusInfo}>
                    <div className={styles.statusLabel}>Batería</div>
                    <div className={styles.statusValue}>
                      {sensor.batteryLevel}%
                    </div>
                    <div className={styles.statusBar}>
                      <div
                        className={`${styles.statusFill} ${
                          sensor.batteryLevel < 20
                            ? styles.batteryLow
                            : styles.batteryGood
                        }`}
                        data-width={sensor.batteryLevel}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className={styles.statusCard}>
                  <div className={styles.statusIcon}>
                    {getSignalIcon(sensor.signalStrength)}
                  </div>
                  <div className={styles.statusInfo}>
                    <div className={styles.statusLabel}>Señal</div>
                    <div className={styles.statusValue}>
                      {sensor.signalStrength}%
                    </div>
                    <div className={styles.statusBar}>
                      <div
                        className={`${styles.statusFill} ${
                          sensor.signalStrength < 30
                            ? styles.signalWeak
                            : styles.signalGood
                        }`}
                        data-width={sensor.signalStrength}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lecturas Actuales */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>🌡️ Lecturas Actuales</h3>
              <div className={styles.readingsGrid}>
                <div className={styles.readingCard}>
                  <div className={styles.readingIcon}>🌡️</div>
                  <div className={styles.readingInfo}>
                    <div className={styles.readingLabel}>Temperatura</div>
                    <div className={styles.readingValue}>
                      {sensor.lastReading.temperature}°C
                    </div>
                    {history && (
                      <div
                        className={`${styles.trend} ${getTrendColor(
                          history.trends.temperature
                        )}`}
                      >
                        {getTrendIcon(history.trends.temperature)}{" "}
                        {history.trends.temperature}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.readingCard}>
                  <div className={styles.readingIcon}>💧</div>
                  <div className={styles.readingInfo}>
                    <div className={styles.readingLabel}>Humedad</div>
                    <div className={styles.readingValue}>
                      {sensor.lastReading.humidity}%
                    </div>
                    {history && (
                      <div
                        className={`${styles.trend} ${getTrendColor(
                          history.trends.humidity
                        )}`}
                      >
                        {getTrendIcon(history.trends.humidity)}{" "}
                        {history.trends.humidity}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.readingCard}>
                  <div className={styles.readingIcon}>🌪️</div>
                  <div className={styles.readingInfo}>
                    <div className={styles.readingLabel}>Presión</div>
                    <div className={styles.readingValue}>
                      {sensor.lastReading.pressure} hPa
                    </div>
                    {history && (
                      <div
                        className={`${styles.trend} ${getTrendColor(
                          history.trends.pressure
                        )}`}
                      >
                        {getTrendIcon(history.trends.pressure)}{" "}
                        {history.trends.pressure}
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.readingCard}>
                  <div className={styles.readingIcon}>💨</div>
                  <div className={styles.readingInfo}>
                    <div className={styles.readingLabel}>Viento</div>
                    <div className={styles.readingValue}>
                      {sensor.lastReading.windSpeed} km/h
                    </div>
                    <div className={styles.readingExtra}>
                      {sensor.lastReading.windDirection}°
                    </div>
                  </div>
                </div>

                <div className={styles.readingCard}>
                  <div className={styles.readingIcon}>👁️</div>
                  <div className={styles.readingInfo}>
                    <div className={styles.readingLabel}>Visibilidad</div>
                    <div className={styles.readingValue}>
                      {(sensor.lastReading.visibility / 1000).toFixed(1)} km
                    </div>
                  </div>
                </div>

                <div className={styles.readingCard}>
                  <div className={styles.readingIcon}>☀️</div>
                  <div className={styles.readingInfo}>
                    <div className={styles.readingLabel}>Índice UV</div>
                    <div className={styles.readingValue}>
                      {sensor.lastReading.uvIndex}
                    </div>
                    <div className={styles.readingExtra}>
                      {sensor.lastReading.uvIndex <= 2
                        ? "Bajo"
                        : sensor.lastReading.uvIndex <= 5
                        ? "Moderado"
                        : sensor.lastReading.uvIndex <= 7
                        ? "Alto"
                        : sensor.lastReading.uvIndex <= 10
                        ? "Muy Alto"
                        : "Extremo"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Promedios Históricos */}
            {history && (
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>📊 Promedios Históricos</h3>
                <div className={styles.averagesGrid}>
                  <div className={styles.averageCard}>
                    <div className={styles.averageLabel}>
                      Temperatura Promedio
                    </div>
                    <div className={styles.averageValue}>
                      {history.averages.temperature}°C
                    </div>
                  </div>
                  <div className={styles.averageCard}>
                    <div className={styles.averageLabel}>Humedad Promedio</div>
                    <div className={styles.averageValue}>
                      {history.averages.humidity}%
                    </div>
                  </div>
                  <div className={styles.averageCard}>
                    <div className={styles.averageLabel}>Presión Promedio</div>
                    <div className={styles.averageValue}>
                      {history.averages.pressure} hPa
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Información de Mantenimiento */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>🔧 Mantenimiento</h3>
              <div className={styles.maintenanceGrid}>
                <div className={styles.maintenanceCard}>
                  <div className={styles.maintenanceLabel}>
                    Fecha de Instalación
                  </div>
                  <div className={styles.maintenanceValue}>
                    {formatDate(sensor.installDate)}
                  </div>
                </div>
                <div className={styles.maintenanceCard}>
                  <div className={styles.maintenanceLabel}>
                    Último Mantenimiento
                  </div>
                  <div className={styles.maintenanceValue}>
                    {formatDate(sensor.lastMaintenance)}
                  </div>
                </div>
                <div className={styles.maintenanceCard}>
                  <div className={styles.maintenanceLabel}>Coordenadas</div>
                  <div className={styles.maintenanceValue}>
                    {sensor.location.coordinates.lat.toFixed(4)},{" "}
                    {sensor.location.coordinates.lon.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>{sensor.name}</h2>
          <p className={styles.location}>
            📍 {sensor.location.city}, {sensor.location.country}
          </p>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          ✕
        </button>
      </div>

      <div className={styles.statusSection}>
        <div className={styles.statusCard}>
          <span className={styles.statusIcon}>
            {getStatusIcon(sensor.status)}
          </span>
          <div className={styles.statusInfo}>
            <span className={styles.statusLabel}>Estado</span>
            <span className={styles.statusValue}>
              {sensor.status.toUpperCase()}
            </span>
          </div>
        </div>

        <div className={styles.deviceInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Batería</span>
            <span className={styles.infoValue}>{sensor.batteryLevel}%</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Señal</span>
            <span className={styles.infoValue}>{sensor.signalStrength}%</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Firmware</span>
            <span className={styles.infoValue}>{sensor.firmware}</span>
          </div>
        </div>
      </div>

      <div className={styles.readingsSection}>
        <h3 className={styles.sectionTitle}>Lecturas Actuales</h3>
        <div className={styles.readings}>
          <div className={styles.reading}>
            <span className={styles.readingLabel}>Temperatura</span>
            <span className={styles.readingValue}>
              {sensor.lastReading.temperature.toFixed(1)}°C
            </span>
          </div>
          <div className={styles.reading}>
            <span className={styles.readingLabel}>Humedad</span>
            <span className={styles.readingValue}>
              {sensor.lastReading.humidity}%
            </span>
          </div>
          <div className={styles.reading}>
            <span className={styles.readingLabel}>Presión</span>
            <span className={styles.readingValue}>
              {sensor.lastReading.pressure} hPa
            </span>
          </div>
          <div className={styles.reading}>
            <span className={styles.readingLabel}>Viento</span>
            <span className={styles.readingValue}>
              {sensor.lastReading.windSpeed} m/s
            </span>
          </div>
          <div className={styles.reading}>
            <span className={styles.readingLabel}>Visibilidad</span>
            <span className={styles.readingValue}>
              {(sensor.lastReading.visibility / 1000).toFixed(1)} km
            </span>
          </div>
          <div className={styles.reading}>
            <span className={styles.readingLabel}>UV Index</span>
            <span className={styles.readingValue}>
              {sensor.lastReading.uvIndex}
            </span>
          </div>
        </div>
      </div>

      {history && (
        <div className={styles.historySection}>
          <h3 className={styles.sectionTitle}>Tendencias</h3>
          <div className={styles.trends}>
            <div className={styles.trend}>
              <span className={styles.trendIcon}>
                {getTrendIcon(history.trends.temperature)}
              </span>
              <span className={styles.trendLabel}>Temperatura</span>
              <span className={styles.trendValue}>
                {history.averages.temperature.toFixed(1)}°C
              </span>
            </div>
            <div className={styles.trend}>
              <span className={styles.trendIcon}>
                {getTrendIcon(history.trends.humidity)}
              </span>
              <span className={styles.trendLabel}>Humedad</span>
              <span className={styles.trendValue}>
                {history.averages.humidity}%
              </span>
            </div>
            <div className={styles.trend}>
              <span className={styles.trendIcon}>
                {getTrendIcon(history.trends.pressure)}
              </span>
              <span className={styles.trendLabel}>Presión</span>
              <span className={styles.trendValue}>
                {history.averages.pressure} hPa
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.metadataSection}>
        <h3 className={styles.sectionTitle}>Información del Dispositivo</h3>
        <div className={styles.metadata}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>ID del Sensor</span>
            <span className={styles.metaValue}>{sensor.id}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Instalación</span>
            <span className={styles.metaValue}>
              {formatDate(sensor.installDate)}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Último Mantenimiento</span>
            <span className={styles.metaValue}>
              {formatDate(sensor.lastMaintenance)}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Zona</span>
            <span className={styles.metaValue}>
              {sensor.location.zone} - {sensor.location.region}
            </span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Coordenadas</span>
            <span className={styles.metaValue}>
              {sensor.location.coordinates.lat.toFixed(4)},{" "}
              {sensor.location.coordinates.lon.toFixed(4)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
