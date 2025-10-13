export type SearchType = {
  city: string
  country: string
}

export type Country = {
  code: string
  name: string
}

export type Weather = {
  name: string
  main: {
    temp: number
    temp_max: number
    temp_min: number
  }
}

// Tipos para el sistema IoT
export type SensorLocation = {
  id: string
  name: string
  city: string
  country: string
  coordinates: {
    lat: number
    lon: number
  }
  region: string
  zone: string
}

export type SensorReading = {
  timestamp: Date
  temperature: number
  humidity: number
  pressure: number
  windSpeed: number
  windDirection: number
  visibility: number
  uvIndex: number
}

export type SensorStatus = "online" | "offline" | "maintenance" | "error"

export type IoTSensor = {
  id: string
  name: string
  location: SensorLocation
  status: SensorStatus
  lastReading: SensorReading
  batteryLevel: number
  signalStrength: number
  firmware: string
  installDate: Date
  lastMaintenance: Date
  isActive: boolean
}

export type SensorHistory = {
  sensorId: string
  readings: SensorReading[]
  averages: {
    temperature: number
    humidity: number
    pressure: number
  }
  trends: {
    temperature: "rising" | "falling" | "stable"
    humidity: "rising" | "falling" | "stable"
    pressure: "rising" | "falling" | "stable"
  }
}

export type Alert = {
  id: string
  sensorId: string
  type: "temperature" | "humidity" | "pressure" | "battery" | "connectivity"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: Date
  isResolved: boolean
  threshold: number
  value: number
}

export type WeatherCondition = {
  id: string
  main: string
  description: string
  icon: string
}

export type SystemStats = {
  totalSensors: number
  activeSensors: number
  offlineSensors: number
  maintenanceSensors: number
  averageTemperature: number
  averageHumidity: number
  averagePressure: number
  lastUpdate: Date
  activeAlerts: number
  dataPoints: number
}

export type UpdateInterval = 5 | 10 | 15 | 30 | 60 // segundos

export type RegionFilter =
  | "all"
  | "north"
  | "south"
  | "east"
  | "west"
  | "center"

export type SensorFilter = {
  region: RegionFilter
  status: SensorStatus | "all"
  showInactive: boolean
}
