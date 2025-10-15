import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import TemperatureChart from "../IoTCharts/TemperatureChart";
import HumidityChart from "../IoTCharts/HumidityChart";
import PressureChart from "../IoTCharts/PressureChart";

interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure?: number;
}

interface SensorLocation {
  location: string;
  lat: number;
  lon: number;
  temperature: number;
  humidity: number;
}

export default function IoTDashboard() {
  const [history, setHistory] = useState<SensorReading[]>([]);
  const [sensors, setSensors] = useState<SensorLocation[]>([]);
  const [intervalMs, setIntervalMs] = useState(5000);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ CONEXIÓN A SOCKET.IO (recibe actualizaciones de Redis)
  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("🔌 Conectado al backend por WebSocket");
    });

    socket.on("weather-update", (data) => {
      console.log("📡 Nuevo dato desde Redis:", data);
      handleIncomingData(data);
    });

    socket.on("disconnect", () => {
      console.log("❌ Desconectado del servidor");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Datos iniciales (solo para visualización si aún no hay conexión)
  useEffect(() => {
    const initialData: SensorReading[] = Array.from({ length: 10 }, (_, i) => ({
      timestamp: new Date(Date.now() - (9 - i) * 60000).toISOString(),
      temperature: 20 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      pressure: 1010 + Math.random() * 20,
    }));
    setHistory(initialData);

    const initialSensors: SensorLocation[] = [
      { location: "Bogotá", lat: 4.6097, lon: -74.0817, temperature: 18, humidity: 75 },
      { location: "Medellín", lat: 6.2518, lon: -75.5636, temperature: 24, humidity: 70 },
      { location: "Cali", lat: 3.4516, lon: -76.532, temperature: 28, humidity: 65 },
      { location: "Barranquilla", lat: 10.9685, lon: -74.7813, temperature: 32, humidity: 80 },
    ];
    setSensors(initialSensors);
  }, []);

  // ✅ Simulador local (solo si no llegan datos desde Redis)
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      generateNewData();
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [intervalMs, isRunning]);

  const handleIncomingData = (data: any) => {
    // Actualiza los sensores según la ciudad recibida
    setSensors((prev) =>
      prev.map((s) =>
        s.location === data.location
          ? { ...s, temperature: data.temperature, humidity: data.humidity }
          : s
      )
    );

    // Agrega al historial
    const newReading: SensorReading = {
      timestamp: new Date().toISOString(),
      temperature: data.temperature ?? 0,
      humidity: data.humidity ?? 0,
      pressure: data.pressure ?? 1010,
    };

    setHistory((prev) => [...prev.slice(-19), newReading]);
  };

  const generateNewData = async () => {
    // Escoge una ciudad aleatoria
    const cities = ["Bogotá", "Medellín", "Cali", "Barranquilla"];
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    const data = {
      location: randomCity,
      temperature: 20 + Math.random() * 10,
      humidity: 50 + Math.random() * 30,
      pressure: 1000 + Math.random() * 30,
    };

    // Envía al backend para que publique en Redis
    await fetch("http://localhost:4000/api/sensors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    console.log("📤 Dato enviado al backend:", data);
  };

  const handleManualUpdate = () => {
    generateNewData();
  };

  return (
    <div
      style={{
        padding: "2rem",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "white",
          fontSize: "2.5rem",
          textShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        🌤️ Sistema IoT - Monitoreo Climático
      </h1>

      {/* Panel de control */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        <label style={{ fontSize: "1.1rem", color: "white" }}>
          ⏱️ Intervalo:
          <select
            value={intervalMs}
            onChange={(e) => setIntervalMs(Number(e.target.value))}
            style={{
              marginLeft: "0.5rem",
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              border: "1px solid #ddd",
              backgroundColor: "white",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            <option value={2000}>2s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
            <option value={30000}>30s</option>
          </select>
        </label>

        <button
          onClick={() => setIsRunning((prev) => !prev)}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: isRunning ? "#f87171" : "#4ade80",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {isRunning ? "⏸️ Pausar" : "▶️ Reanudar"}
        </button>

        <button
          onClick={handleManualUpdate}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#60a5fa",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          🔄 Actualizar ahora
        </button>

        <span style={{ fontSize: "1.1rem", color: "white" }}>
          {isRunning ? "🟢 Actualizando" : "⏸️ Pausado"} | Sensores activos:{" "}
          <strong>{sensors.length}</strong>
        </span>
      </div>

      {/* Gráficas */}
      <div
        style={{
          display: "grid",
          gap: "2rem",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <TemperatureChart history={history} />
          <HumidityChart history={history} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "1.5rem",
          }}
        >
          <PressureChart history={history} />

          {/* Panel de estadísticas */}
          <div
            style={{
              background: "rgba(255,255,255,1)",
              padding: "2rem",
              borderRadius: "16px",
              boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              minHeight: "340px",
            }}
          >
            <h3
              style={{
                margin: "0 0 1.2rem 0",
                color: "#222",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textShadow: "0 1px 2px rgba(0,0,0,0.2)",
              }}
            >
              📊 Estadísticas por Ciudad
            </h3>

            <div
              style={{
                fontSize: "1.1rem",
                color: "#222",
                width: "100%",
                display: "grid",
                gap: "0.6rem",
              }}
            >
              {sensors.map((s) => (
                <div
                  key={s.location}
                  style={{
                    background: "rgba(240,240,240,0.9)",
                    padding: "0.6rem",
                    borderRadius: "8px",
                  }}
                >
                  <strong>{s.location}</strong> — 🌡️ {s.temperature.toFixed(1)}°C | 💧{" "}
                  {s.humidity.toFixed(1)}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
