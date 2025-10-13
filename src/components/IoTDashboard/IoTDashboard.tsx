import { useState } from "react"
import useIoTSensors from "../../hooks/useIoTSensors"
import SensorCard from "../SensorCard/SensorCard"
import SystemStats from "../SystemStats/SystemStats"
import AlertPanel from "../AlertPanel/AlertPanel"
import SensorDetail from "../SensorDetail/SensorDetail"
import ControlPanel from "../ControlPanel/ControlPanel"
import styles from "./IoTDashboard.module.css"

export default function IoTDashboard() {
  const {
    sensors,
    filteredSensors,
    selectedSensor,
    sensorHistory,
    alerts,
    systemStats,
    isLoading,
    isConnected,
    lastUpdate,
    selectSensor,
    refreshData,
    resolveAlert,
    updateInterval,
    setUpdateInterval,
    filter,
    setFilter,
    isAutoUpdate,
    toggleAutoUpdate,
  } = useIoTSensors()

  const [showAlerts, setShowAlerts] = useState(false)
  const [showSensorModal, setShowSensorModal] = useState(false)

  const handleSensorClick = (sensorId: string) => {
    selectSensor(sensorId)
    setShowSensorModal(true)
  }

  const closeSensorModal = () => {
    setShowSensorModal(false)
    selectSensor(null)
  }

  if (isLoading && sensors.length === 0) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Conectando con sensores IoT...</p>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Sistema IoT de Monitoreo Climático</h1>
          <div className={styles.connectionStatus}>
            <span
              className={`${styles.statusDot} ${
                isConnected ? styles.connected : styles.disconnected
              }`}
            ></span>
            <span className={styles.statusText}>
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
            {lastUpdate && (
              <span className={styles.lastUpdate}>
                Última actualización: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <ControlPanel
          updateInterval={updateInterval}
          setUpdateInterval={setUpdateInterval}
          filter={filter}
          setFilter={setFilter}
          isAutoUpdate={isAutoUpdate}
          toggleAutoUpdate={toggleAutoUpdate}
          onRefresh={refreshData}
          alertCount={alerts.length}
          onToggleAlerts={() => setShowAlerts(!showAlerts)}
        />
      </header>

      <div className={styles.statsSection}>
        <SystemStats stats={systemStats} />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.sensorsGrid}>
          <div className={styles.gridHeader}>
            <h2 className={styles.sectionTitle}>
              Sensores Activos ({filteredSensors.length})
            </h2>
            <div className={styles.gridControls}>
              <select
                value={filter.region}
                onChange={(e) =>
                  setFilter({
                    region: e.target.value as
                      | "all"
                      | "north"
                      | "south"
                      | "east"
                      | "west"
                      | "center",
                  })
                }
                className={styles.regionFilter}
                title="Filtrar por región"
              >
                <option value="all">Todas las regiones</option>
                <option value="north">Norte</option>
                <option value="south">Sur</option>
                <option value="east">Este</option>
                <option value="west">Oeste</option>
                <option value="center">Centro</option>
              </select>
            </div>
          </div>

          <div className={styles.sensors}>
            {filteredSensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                onClick={() => handleSensorClick(sensor.id)}
                isSelected={false}
              />
            ))}
          </div>

          {filteredSensors.length === 0 && (
            <div className={styles.noSensors}>
              <p>No se encontraron sensores con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal del SensorDetail */}
      {showSensorModal && selectedSensor && (
        <SensorDetail
          sensor={selectedSensor}
          history={sensorHistory}
          onClose={closeSensorModal}
          isModal={true}
        />
      )}

      {showAlerts && (
        <AlertPanel
          alerts={alerts}
          onResolveAlert={resolveAlert}
          onClose={() => setShowAlerts(false)}
        />
      )}
    </div>
  )
}
