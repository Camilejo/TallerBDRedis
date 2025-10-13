import { useState, useEffect, useCallback, useMemo } from "react"
import {
  IoTSensor,
  SensorHistory,
  Alert,
  SystemStats,
  UpdateInterval,
  SensorFilter,
} from "../types"
import { iotSimulator } from "../data/iotSimulator"

export interface UseIoTSensorsReturn {
  // Datos principales
  sensors: IoTSensor[]
  filteredSensors: IoTSensor[]
  selectedSensor: IoTSensor | null
  sensorHistory: SensorHistory | null
  alerts: Alert[]
  systemStats: SystemStats

  // Estados de carga
  isLoading: boolean
  isConnected: boolean
  lastUpdate: Date | null

  // Acciones
  selectSensor: (sensorId: string | null) => void
  refreshData: () => void
  resolveAlert: (alertId: string) => void

  // Configuración
  updateInterval: UpdateInterval
  setUpdateInterval: (interval: UpdateInterval) => void
  filter: SensorFilter
  setFilter: (filter: Partial<SensorFilter>) => void

  // Auto-actualización
  isAutoUpdate: boolean
  toggleAutoUpdate: () => void
}

export default function useIoTSensors(): UseIoTSensorsReturn {
  // Estados principales
  const [sensors, setSensors] = useState<IoTSensor[]>([])
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null)
  const [sensorHistory, setSensorHistory] = useState<SensorHistory | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats>({
    totalSensors: 0,
    activeSensors: 0,
    offlineSensors: 0,
    maintenanceSensors: 0,
    averageTemperature: 0,
    averageHumidity: 0,
    averagePressure: 0,
    lastUpdate: new Date(),
    activeAlerts: 0,
    dataPoints: 0,
  })

  // Estados de configuración
  const [updateInterval, setUpdateInterval] = useState<UpdateInterval>(10)
  const [filter, setFilterState] = useState<SensorFilter>({
    region: "all",
    status: "all",
    showInactive: true,
  })
  const [isAutoUpdate, setIsAutoUpdate] = useState(true)

  // Estados de control
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Función para cargar datos del simulador
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true)

      // Simular pequeña latencia para realismo
      await new Promise((resolve) => setTimeout(resolve, 100))

      const sensorsData = iotSimulator.getSensors()
      const alertsData = iotSimulator.getAlerts()
      const statsData = iotSimulator.getSystemStats()

      setSensors(sensorsData)
      setAlerts(alertsData)
      setSystemStats(statsData)
      setLastUpdate(new Date())
      setIsConnected(true)

      // Cargar historial del sensor seleccionado si existe
      if (selectedSensorId) {
        const history = iotSimulator.getSensorHistory(selectedSensorId)
        setSensorHistory(history)
      }
    } catch (error) {
      console.error("Error loading IoT data:", error)
      setIsConnected(false)
    } finally {
      setIsLoading(false)
    }
  }, [selectedSensorId])

  // Inicializar simulador y cargar datos iniciales
  useEffect(() => {
    loadData()

    // Iniciar simulación automática
    iotSimulator.startSimulation(5) // Actualizar cada 5 segundos internamente

    return () => {
      iotSimulator.stopSimulation()
    }
  }, [loadData])

  // Auto-actualización basada en intervalo configurado
  useEffect(() => {
    if (!isAutoUpdate) return

    const intervalId = setInterval(() => {
      loadData()
    }, updateInterval * 1000)

    return () => clearInterval(intervalId)
  }, [loadData, updateInterval, isAutoUpdate])

  // Sensor seleccionado
  const selectedSensor = useMemo(() => {
    return selectedSensorId
      ? sensors.find((s) => s.id === selectedSensorId) || null
      : null
  }, [sensors, selectedSensorId])

  // Sensores filtrados
  const filteredSensors = useMemo(() => {
    return sensors.filter((sensor) => {
      // Filtro por región
      if (filter.region !== "all" && sensor.location.region !== filter.region) {
        return false
      }

      // Filtro por estado
      if (filter.status !== "all" && sensor.status !== filter.status) {
        return false
      }

      // Filtro por activos/inactivos
      if (!filter.showInactive && !sensor.isActive) {
        return false
      }

      return true
    })
  }, [sensors, filter])

  // Acciones
  const selectSensor = useCallback((sensorId: string | null) => {
    setSelectedSensorId(sensorId)

    if (sensorId) {
      const history = iotSimulator.getSensorHistory(sensorId)
      setSensorHistory(history)
    } else {
      setSensorHistory(null)
    }
  }, [])

  const refreshData = useCallback(() => {
    loadData()
  }, [loadData])

  const resolveAlert = useCallback((alertId: string) => {
    const success = iotSimulator.resolveAlert(alertId)
    if (success) {
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
    }
  }, [])

  const setFilter = useCallback((newFilter: Partial<SensorFilter>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }))
  }, [])

  const toggleAutoUpdate = useCallback(() => {
    setIsAutoUpdate((prev) => !prev)
  }, [])

  return {
    // Datos principales
    sensors,
    filteredSensors,
    selectedSensor,
    sensorHistory,
    alerts,
    systemStats,

    // Estados de carga
    isLoading,
    isConnected,
    lastUpdate,

    // Acciones
    selectSensor,
    refreshData,
    resolveAlert,

    // Configuración
    updateInterval,
    setUpdateInterval,
    filter,
    setFilter,

    // Auto-actualización
    isAutoUpdate,
    toggleAutoUpdate,
  }
}
