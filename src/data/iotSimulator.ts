import {
  IoTSensor,
  SensorReading,
  SensorLocation,
  Alert,
  SensorHistory,
} from "../types"

// Datos de ubicaciones de sensores simulados
const SENSOR_LOCATIONS: SensorLocation[] = [
  {
    id: "loc-001",
    name: "Centro Histórico",
    city: "Bogotá",
    country: "Colombia",
    coordinates: { lat: 4.5981, lon: -74.0758 },
    region: "center",
    zone: "urban",
  },
  {
    id: "loc-002",
    name: "Zona Norte",
    city: "Medellín",
    country: "Colombia",
    coordinates: { lat: 6.2442, lon: -75.5812 },
    region: "north",
    zone: "urban",
  },
  {
    id: "loc-003",
    name: "Puerto Marítimo",
    city: "Cartagena",
    country: "Colombia",
    coordinates: { lat: 10.4236, lon: -75.5378 },
    region: "north",
    zone: "coastal",
  },
  {
    id: "loc-004",
    name: "Zona Industrial",
    city: "Cali",
    country: "Colombia",
    coordinates: { lat: 3.4516, lon: -76.532 },
    region: "south",
    zone: "industrial",
  },
  {
    id: "loc-005",
    name: "Campus Universitario",
    city: "Bucaramanga",
    country: "Colombia",
    coordinates: { lat: 7.1253, lon: -73.1198 },
    region: "east",
    zone: "educational",
  },
  {
    id: "loc-006",
    name: "Parque Nacional",
    city: "Manizales",
    country: "Colombia",
    coordinates: { lat: 5.07, lon: -75.5138 },
    region: "center",
    zone: "natural",
  },
  {
    id: "loc-007",
    name: "Puerto Pacífico",
    city: "Buenaventura",
    country: "Colombia",
    coordinates: { lat: 3.8801, lon: -77.0313 },
    region: "west",
    zone: "coastal",
  },
  {
    id: "loc-008",
    name: "Aeropuerto Internacional",
    city: "Barranquilla",
    country: "Colombia",
    coordinates: { lat: 10.8896, lon: -74.7804 },
    region: "north",
    zone: "transport",
  },
  {
    id: "loc-009",
    name: "Zona Petrolera",
    city: "Arauca",
    country: "Colombia",
    coordinates: { lat: 7.0832, lon: -70.7619 },
    region: "east",
    zone: "industrial",
  },
  {
    id: "loc-010",
    name: "Selva Amazónica",
    city: "Leticia",
    country: "Colombia",
    coordinates: { lat: -4.2158, lon: -69.9406 },
    region: "south",
    zone: "natural",
  },
  {
    id: "loc-011",
    name: "Centro Minero",
    city: "Pereira",
    country: "Colombia",
    coordinates: { lat: 4.8133, lon: -75.6961 },
    region: "west",
    zone: "industrial",
  },
  {
    id: "loc-012",
    name: "Zona Cafetera",
    city: "Armenia",
    country: "Colombia",
    coordinates: { lat: 4.5339, lon: -75.6811 },
    region: "west",
    zone: "agricultural",
  },
]

// Clase para simular sensores IoT
export class IoTSensorSimulator {
  private sensors: IoTSensor[] = []
  private readings: Map<string, SensorReading[]> = new Map()
  private alerts: Alert[] = []
  private isRunning = false
  private intervalId: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.initializeSensors()
  }

  private initializeSensors(): void {
    this.sensors = SENSOR_LOCATIONS.map((location, index) => ({
      id: `sensor-${(index + 1).toString().padStart(3, "0")}`,
      name: `Sensor ${location.name}`,
      location,
      status: Math.random() > 0.1 ? "online" : "offline",
      lastReading: this.generateReading(location),
      batteryLevel: Math.floor(Math.random() * 100),
      signalStrength: Math.floor(Math.random() * 100),
      firmware: `v2.${Math.floor(Math.random() * 10)}.${Math.floor(
        Math.random() * 10
      )}`,
      installDate: new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
      ),
      lastMaintenance: new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000
      ),
      isActive: Math.random() > 0.05,
    }))

    // Inicializar historial de readings
    this.sensors.forEach((sensor) => {
      const history: SensorReading[] = []
      for (let i = 0; i < 100; i++) {
        history.push(
          this.generateReading(
            sensor.location,
            new Date(Date.now() - i * 60000)
          )
        )
      }
      this.readings.set(sensor.id, history.reverse())
    })
  }

  private generateReading(
    location: SensorLocation,
    timestamp: Date = new Date()
  ): SensorReading {
    // Simular variaciones climáticas basadas en la ubicación
    const baseTemp = this.getBaseTemperature(location)
    const tempVariation = (Math.random() - 0.5) * 10

    const baseHumidity = this.getBaseHumidity(location)
    const humidityVariation = (Math.random() - 0.5) * 30

    const basePressure = this.getBasePressure(location)
    const pressureVariation = (Math.random() - 0.5) * 50

    return {
      timestamp,
      temperature: Math.round((baseTemp + tempVariation) * 10) / 10,
      humidity: Math.max(
        0,
        Math.min(100, Math.round(baseHumidity + humidityVariation))
      ),
      pressure: Math.round(basePressure + pressureVariation),
      windSpeed: Math.round(Math.random() * 50 * 10) / 10,
      windDirection: Math.floor(Math.random() * 360),
      visibility: Math.round(Math.random() * 20000),
      uvIndex: Math.floor(Math.random() * 11),
    }
  }

  private getBaseTemperature(location: SensorLocation): number {
    // Temperatura base según la ubicación geográfica
    const cityTemps: Record<string, number> = {
      Bogotá: 15,
      Medellín: 22,
      Cartagena: 28,
      Cali: 25,
      Bucaramanga: 24,
      Manizales: 18,
    }
    return cityTemps[location.city] || 20
  }

  private getBaseHumidity(location: SensorLocation): number {
    // Humedad base según la zona
    const zoneHumidity: Record<string, number> = {
      coastal: 80,
      urban: 65,
      industrial: 60,
      natural: 75,
      educational: 70,
    }
    return zoneHumidity[location.zone] || 65
  }

  private getBasePressure(location: SensorLocation): number {
    // Presión atmosférica base según altitud (aproximada)
    const cityPressure: Record<string, number> = {
      Bogotá: 750, // Mayor altitud
      Medellín: 860,
      Cartagena: 1013, // Nivel del mar
      Cali: 950,
      Bucaramanga: 920,
      Manizales: 800,
    }
    return cityPressure[location.city] || 1013
  }

  private updateReadings(): void {
    this.sensors.forEach((sensor) => {
      if (sensor.status === "online" && sensor.isActive) {
        const newReading = this.generateReading(sensor.location)
        sensor.lastReading = newReading

        // Agregar al historial
        const history = this.readings.get(sensor.id) || []
        history.push(newReading)

        // Mantener solo las últimas 1000 lecturas
        if (history.length > 1000) {
          history.shift()
        }

        this.readings.set(sensor.id, history)

        // Verificar alertas
        this.checkAlerts(sensor, newReading)

        // Simular cambios de estado ocasionales
        if (Math.random() < 0.001) {
          sensor.status = Math.random() > 0.7 ? "offline" : "maintenance"
        }

        // Simular degradación de batería
        if (Math.random() < 0.01) {
          sensor.batteryLevel = Math.max(0, sensor.batteryLevel - 1)
        }
      }
    })
  }

  private checkAlerts(sensor: IoTSensor, reading: SensorReading): void {
    const alerts: Alert[] = []

    // Alerta de temperatura extrema
    if (reading.temperature > 35 || reading.temperature < 0) {
      alerts.push({
        id: `alert-${Date.now()}-temp`,
        sensorId: sensor.id,
        type: "temperature",
        severity:
          reading.temperature > 40 || reading.temperature < -5
            ? "critical"
            : "high",
        message: `Temperatura ${reading.temperature > 35 ? "alta" : "baja"}: ${
          reading.temperature
        }°C`,
        timestamp: new Date(),
        isResolved: false,
        threshold: reading.temperature > 35 ? 35 : 0,
        value: reading.temperature,
      })
    }

    // Alerta de humedad extrema
    if (reading.humidity > 90 || reading.humidity < 10) {
      alerts.push({
        id: `alert-${Date.now()}-hum`,
        sensorId: sensor.id,
        type: "humidity",
        severity:
          reading.humidity > 95 || reading.humidity < 5 ? "critical" : "medium",
        message: `Humedad ${reading.humidity > 90 ? "alta" : "baja"}: ${
          reading.humidity
        }%`,
        timestamp: new Date(),
        isResolved: false,
        threshold: reading.humidity > 90 ? 90 : 10,
        value: reading.humidity,
      })
    }

    // Alerta de batería baja
    if (sensor.batteryLevel < 20) {
      alerts.push({
        id: `alert-${Date.now()}-bat`,
        sensorId: sensor.id,
        type: "battery",
        severity: sensor.batteryLevel < 10 ? "critical" : "medium",
        message: `Batería baja: ${sensor.batteryLevel}%`,
        timestamp: new Date(),
        isResolved: false,
        threshold: 20,
        value: sensor.batteryLevel,
      })
    }

    this.alerts.push(...alerts)
  }

  // Métodos públicos para la API
  public getSensors(): IoTSensor[] {
    return [...this.sensors]
  }

  public getSensor(id: string): IoTSensor | undefined {
    return this.sensors.find((s) => s.id === id)
  }

  public getSensorHistory(
    sensorId: string,
    limit: number = 100
  ): SensorHistory | null {
    const sensor = this.getSensor(sensorId)
    if (!sensor) return null

    const readings = this.readings.get(sensorId) || []
    const recentReadings = readings.slice(-limit)

    if (recentReadings.length === 0) return null

    // Calcular promedios
    const avgTemp =
      recentReadings.reduce((sum, r) => sum + r.temperature, 0) /
      recentReadings.length
    const avgHum =
      recentReadings.reduce((sum, r) => sum + r.humidity, 0) /
      recentReadings.length
    const avgPress =
      recentReadings.reduce((sum, r) => sum + r.pressure, 0) /
      recentReadings.length

    // Calcular tendencias (comparando últimas 10 vs anteriores 10)
    const recent = recentReadings.slice(-10)
    const previous = recentReadings.slice(-20, -10)

    const getTrend = (recentAvg: number, previousAvg: number) => {
      const diff = recentAvg - previousAvg
      if (Math.abs(diff) < 0.5) return "stable" as const
      return diff > 0 ? ("rising" as const) : ("falling" as const)
    }

    const recentTempAvg =
      recent.reduce((sum, r) => sum + r.temperature, 0) / recent.length
    const previousTempAvg =
      previous.reduce((sum, r) => sum + r.temperature, 0) / previous.length

    const recentHumAvg =
      recent.reduce((sum, r) => sum + r.humidity, 0) / recent.length
    const previousHumAvg =
      previous.reduce((sum, r) => sum + r.humidity, 0) / previous.length

    const recentPressAvg =
      recent.reduce((sum, r) => sum + r.pressure, 0) / recent.length
    const previousPressAvg =
      previous.reduce((sum, r) => sum + r.pressure, 0) / previous.length

    return {
      sensorId,
      readings: recentReadings,
      averages: {
        temperature: Math.round(avgTemp * 10) / 10,
        humidity: Math.round(avgHum),
        pressure: Math.round(avgPress),
      },
      trends: {
        temperature: getTrend(recentTempAvg, previousTempAvg),
        humidity: getTrend(recentHumAvg, previousHumAvg),
        pressure: getTrend(recentPressAvg, previousPressAvg),
      },
    }
  }

  public getAlerts(limit: number = 50): Alert[] {
    return this.alerts
      .filter((alert) => !alert.isResolved)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit)
  }

  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId)
    if (alert) {
      alert.isResolved = true
      return true
    }
    return false
  }

  public startSimulation(intervalSeconds: number = 10): void {
    if (this.isRunning) return

    this.isRunning = true
    this.intervalId = setInterval(() => {
      this.updateReadings()
    }, intervalSeconds * 1000)
  }

  public stopSimulation(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    this.isRunning = false
  }

  public getSystemStats() {
    const totalSensors = this.sensors.length
    const activeSensors = this.sensors.filter(
      (s) => s.status === "online"
    ).length
    const offlineSensors = this.sensors.filter(
      (s) => s.status === "offline"
    ).length
    const maintenanceSensors = this.sensors.filter(
      (s) => s.status === "maintenance"
    ).length

    const onlineSensors = this.sensors.filter((s) => s.status === "online")
    const avgTemp =
      onlineSensors.reduce((sum, s) => sum + s.lastReading.temperature, 0) /
      onlineSensors.length
    const avgHum =
      onlineSensors.reduce((sum, s) => sum + s.lastReading.humidity, 0) /
      onlineSensors.length
    const avgPress =
      onlineSensors.reduce((sum, s) => sum + s.lastReading.pressure, 0) /
      onlineSensors.length

    return {
      totalSensors,
      activeSensors,
      offlineSensors,
      maintenanceSensors,
      averageTemperature: Math.round(avgTemp * 10) / 10,
      averageHumidity: Math.round(avgHum),
      averagePressure: Math.round(avgPress),
      lastUpdate: new Date(),
      activeAlerts: this.getAlerts().length,
      dataPoints: Array.from(this.readings.values()).reduce(
        (sum, readings) => sum + readings.length,
        0
      ),
    }
  }
}

// Instancia global del simulador
export const iotSimulator = new IoTSensorSimulator()
