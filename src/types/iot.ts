// 📄 src/types/iot.ts
export interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure?: number;
  windSpeed?: number;
}

export interface SensorLocation {
  id?: string;
  location: string;
  lat: number;
  lng: number;
  temperature: number;
  humidity: number;
  pressure?: number;
  lastUpdate?: string;
}

export interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  icon?: string;
}

export interface ChartProps {
  history: SensorReading[];
}

export interface HeatmapProps {
  sensors?: SensorLocation[];
}

export interface SocketMessage {
  type: 'sensor_data' | 'alert' | 'status';
  data: any;
  timestamp: string;
}