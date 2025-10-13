import React from "react"
import { SystemStats as SystemStatsType } from "../../types"
import styles from "./SystemStats.module.css"

interface SystemStatsProps {
  stats: SystemStatsType
}

export default function SystemStats({ stats }: SystemStatsProps) {
  const getPercentage = (value: number, total: number) => {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  return (
    <div className={styles.statsContainer}>
      <div className={styles.stat}>
        <div className={styles.statHeader}>
          <span className={styles.statIcon}>🌡️</span>
          <span className={styles.statLabel}>Temperatura Promedio</span>
        </div>
        <div className={styles.statValue}>
          {stats.averageTemperature.toFixed(1)}°C
        </div>
        <div className={styles.statTrend}>
          {stats.averageTemperature > 25
            ? "🔥 Cálido"
            : stats.averageTemperature < 15
            ? "❄️ Frío"
            : "🌤️ Templado"}
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.statHeader}>
          <span className={styles.statIcon}>💧</span>
          <span className={styles.statLabel}>Humedad Promedio</span>
        </div>
        <div className={styles.statValue}>{stats.averageHumidity}%</div>
        <div className={styles.statTrend}>
          {stats.averageHumidity > 70
            ? "💧 Húmedo"
            : stats.averageHumidity < 40
            ? "🏜️ Seco"
            : "🌿 Normal"}
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.statHeader}>
          <span className={styles.statIcon}>🌀</span>
          <span className={styles.statLabel}>Presión Promedio</span>
        </div>
        <div className={styles.statValue}>{stats.averagePressure} hPa</div>
        <div className={styles.statTrend}>
          {stats.averagePressure > 1020
            ? "⬆️ Alta"
            : stats.averagePressure < 1000
            ? "⬇️ Baja"
            : "➡️ Normal"}
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.statHeader}>
          <span className={styles.statIcon}>📡</span>
          <span className={styles.statLabel}>Sensores Activos</span>
        </div>
        <div className={styles.statValue}>
          {stats.activeSensors}/{stats.totalSensors}
        </div>
        <div className={styles.statProgress}>
          <div
            className={styles.progressBar}
            style={
              {
                "--progress-width": `${getPercentage(
                  stats.activeSensors,
                  stats.totalSensors
                )}%`,
              } as React.CSSProperties
            }
          ></div>
        </div>
        <div className={styles.statTrend}>
          {getPercentage(stats.activeSensors, stats.totalSensors)}% Online
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.statHeader}>
          <span className={styles.statIcon}>⚠️</span>
          <span className={styles.statLabel}>Alertas Activas</span>
        </div>
        <div className={styles.statValue}>{stats.activeAlerts}</div>
        <div className={styles.statTrend}>
          {stats.activeAlerts === 0
            ? "✅ Todo OK"
            : stats.activeAlerts > 5
            ? "🚨 Crítico"
            : "⚠️ Atención"}
        </div>
      </div>

      <div className={styles.stat}>
        <div className={styles.statHeader}>
          <span className={styles.statIcon}>📊</span>
          <span className={styles.statLabel}>Puntos de Datos</span>
        </div>
        <div className={styles.statValue}>
          {stats.dataPoints.toLocaleString()}
        </div>
        <div className={styles.statTrend}>📈 Recopilando</div>
      </div>
    </div>
  )
}
