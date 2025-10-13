import { UpdateInterval, SensorFilter } from "../../types"
import styles from "./ControlPanel.module.css"

interface ControlPanelProps {
  updateInterval: UpdateInterval
  setUpdateInterval: (interval: UpdateInterval) => void
  filter: SensorFilter
  setFilter: (filter: Partial<SensorFilter>) => void
  isAutoUpdate: boolean
  toggleAutoUpdate: () => void
  onRefresh: () => void
  alertCount: number
  onToggleAlerts: () => void
}

export default function ControlPanel({
  updateInterval,
  setUpdateInterval,
  isAutoUpdate,
  toggleAutoUpdate,
  onRefresh,
  alertCount,
  onToggleAlerts,
}: ControlPanelProps) {
  return (
    <div className={styles.panel}>
      <div className={styles.controls}>
        <div className={styles.control}>
          <label htmlFor="updateInterval" className={styles.label}>
            Intervalo de actualización:
          </label>
          <select
            id="updateInterval"
            value={updateInterval}
            onChange={(e) =>
              setUpdateInterval(Number(e.target.value) as UpdateInterval)
            }
            className={styles.select}
          >
            <option value={5}>5 segundos</option>
            <option value={10}>10 segundos</option>
            <option value={15}>15 segundos</option>
            <option value={30}>30 segundos</option>
            <option value={60}>1 minuto</option>
          </select>
        </div>

        <button
          onClick={toggleAutoUpdate}
          className={`${styles.button} ${isAutoUpdate ? styles.active : ""}`}
          title={
            isAutoUpdate
              ? "Desactivar auto-actualización"
              : "Activar auto-actualización"
          }
        >
          {isAutoUpdate ? "⏸️" : "▶️"} Auto
        </button>

        <button
          onClick={onRefresh}
          className={styles.button}
          title="Actualizar datos"
        >
          🔄 Actualizar
        </button>

        <button
          onClick={onToggleAlerts}
          className={`${styles.button} ${
            alertCount > 0 ? styles.hasAlerts : ""
          }`}
          title={`${alertCount} alertas activas`}
        >
          🚨 Alertas {alertCount > 0 && `(${alertCount})`}
        </button>
      </div>
    </div>
  )
}
