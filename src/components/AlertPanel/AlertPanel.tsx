import { Alert } from "../../types"
import styles from "./AlertPanel.module.css"

interface AlertPanelProps {
  alerts: Alert[]
  onResolveAlert: (alertId: string) => void
  onClose: () => void
}

export default function AlertPanel({
  alerts,
  onResolveAlert,
  onClose,
}: AlertPanelProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return "🚨"
      case "high":
        return "⚠️"
      case "medium":
        return "⚡"
      case "low":
        return "ℹ️"
      default:
        return "📋"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return styles.critical
      case "high":
        return styles.high
      case "medium":
        return styles.medium
      case "low":
        return styles.low
      default:
        return styles.info
    }
  }

  return (
    <>
      <div className={styles.overlay} onClick={onClose}></div>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>🚨 Alertas Activas ({alerts.length})</h2>
          <button onClick={onClose} className={styles.closeButton}>
            ✕
          </button>
        </div>

        <div className={styles.alertsList}>
          {alerts.length === 0 ? (
            <div className={styles.noAlerts}>
              <p>✅ No hay alertas activas</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`${styles.alert} ${getSeverityColor(
                  alert.severity
                )}`}
              >
                <div className={styles.alertHeader}>
                  <span className={styles.alertIcon}>
                    {getSeverityIcon(alert.severity)}
                  </span>
                  <span className={styles.alertType}>
                    {alert.type.toUpperCase()}
                  </span>
                  <span className={styles.alertSeverity}>
                    {alert.severity.toUpperCase()}
                  </span>
                  <span className={styles.alertTime}>
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                </div>

                <div className={styles.alertMessage}>{alert.message}</div>

                <div className={styles.alertFooter}>
                  <span className={styles.alertValue}>
                    Valor: {alert.value} (Umbral: {alert.threshold})
                  </span>
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className={styles.resolveButton}
                  >
                    ✓ Resolver
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
