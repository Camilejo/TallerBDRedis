// 📄 src/components/Dashboard.tsx
import React, { useEffect, useState } from "react";
import TemperatureChart from "./IoTCharts/TemperatureChart";
import HumidityChart from "./IoTCharts/HumidityChart";
import PressureChart from "./IoTCharts/PressureChart";
import Heatmap from "./IoTCharts/Heatmap";

interface SensorData {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure: number;
}

interface SensorLocation {
  lat: number;
  lon: number;
  temperature: number;
  humidity?: number;
}

export default function Dashboard() {
  const [history, setHistory] = useState<SensorData[]>([]);
  const [sensors, setSensors] = useState<SensorLocation[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  // Simulador de datos
  useEffect(() => {
    // Inicializar con algunos datos históricos
    const initialHistory: SensorData[] = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(Date.now() - (10 - i) * 2000).toLocaleTimeString(),
      temperature: 20 + Math.random() * 10,
      humidity: 40 + Math.random() * 30,
      pressure: 1000 + Math.random() * 20,
    }));
    setHistory(initialHistory);

    const interval = setInterval(() => {
      const newEntry: SensorData = {
        timestamp: new Date().toLocaleTimeString(),
        temperature: 20 + Math.random() * 10, // 20°C a 30°C
        humidity: 40 + Math.random() * 30, // 40% a 70%
        pressure: 1000 + Math.random() * 20, // 1000 hPa a 1020 hPa
      };

      setHistory((prev) => [...prev.slice(-19), newEntry]); // Mantener últimas 20

      setSensors([
        {
          lat: 4.65,
          lon: -74.1,
          temperature: newEntry.temperature,
          humidity: newEntry.humidity,
        },
        {
          lat: 4.7,
          lon: -74.05,
          temperature: 18 + Math.random() * 10,
          humidity: 45 + Math.random() * 25,
        },
        {
          lat: 4.6,
          lon: -74.15,
          temperature: 22 + Math.random() * 5,
          humidity: 50 + Math.random() * 20,
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestData = history[history.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-start p-6 space-y-6">
      {/* Header */}
      <div className="w-full max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-3xl font-bold">
            🌦️ Sistema IoT - Monitoreo Climático
          </h1>
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"
              }`}
            />
            <span className="text-white text-sm font-medium">
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        {latestData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Temperatura</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {latestData.temperature.toFixed(1)}°C
                  </p>
                </div>
                <div className="text-4xl">🌡️</div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Humedad</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {latestData.humidity.toFixed(1)}%
                  </p>
                </div>
                <div className="text-4xl">💧</div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Presión</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {latestData.pressure.toFixed(0)} hPa
                  </p>
                </div>
                <div className="text-4xl">🌪️</div>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Sensores Activos</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {sensors.length}
                  </p>
                </div>
                <div className="text-4xl">📡</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
          <TemperatureChart history={history} />
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
          <HumidityChart history={history} />
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
          <PressureChart history={history} />
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow">
          <Heatmap sensors={sensors} />
        </div>
      </div>

      {/* Footer */}
      <div className="text-white/80 text-sm mt-4">
        Última actualización: {latestData?.timestamp || "N/A"}
      </div>
    </div>
  );
}