import { useState, useEffect, useCallback, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import {
  IoTSensor,
  SensorHistory,
  Alert,
  SystemStats,
  UpdateInterval,
  SensorFilter,
} from "../types";
import { iotSimulator } from "../data/iotSimulator";

export interface UseIoTSensorsReturn {
  sensors: IoTSensor[];
  filteredSensors: IoTSensor[];
  selectedSensor: IoTSensor | null;
  sensorHistory: SensorHistory | null;
  alerts: Alert[];
  systemStats: SystemStats;

  isLoading: boolean;
  isConnected: boolean;
  lastUpdate: Date | null;

  selectSensor: (sensorId: string | null) => void;
  refreshData: () => void;
  resolveAlert: (alertId: string) => void;

  updateInterval: UpdateInterval;
  setUpdateInterval: (interval: UpdateInterval) => void;
  filter: SensorFilter;
  setFilter: (filter: Partial<SensorFilter>) => void;

  isAutoUpdate: boolean;
  toggleAutoUpdate: () => void;
}

export default function useIoTSensors(): UseIoTSensorsReturn {
  // --- Estados principales ---
  const [sensors, setSensors] = useState<IoTSensor[]>([]);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [sensorHistory, setSensorHistory] = useState<SensorHistory | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
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
  });

  // --- Estados de configuración ---
  const [updateInterval, setUpdateInterval] = useState<UpdateInterval>(10);
  const [filter, setFilterState] = useState<SensorFilter>({
    region: "all",
    status: "all",
    showInactive: true,
  });
  const [isAutoUpdate, setIsAutoUpdate] = useState(true);

  // --- Control de conexión ---
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // --- Conexión con Socket.io ---
  useEffect(() => {
    const socket: Socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("Conectado al servidor Redis/Socket.io");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    // Si se reciben actualizaciones desde Redis
    socket.on("weather-update", (data) => {
      console.log("Datos recibidos desde Redis:", data);
      setLastUpdate(new Date());
      setSystemStats((prev) => ({
        ...prev,
        averageTemperature: data.temperature,
        averageHumidity: data.humidity,
        averagePressure: data.pressure,
        lastUpdate: new Date(),
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // --- Función para cargar datos del simulador ---
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Pequeño delay para simular latencia
      await new Promise((resolve) => setTimeout(resolve, 100));

      const sensorsData = iotSimulator.getSensors();
      const alertsData = iotSimulator.getAlerts();
      const statsData = iotSimulator.getSystemStats();

      setSensors(sensorsData);
      setAlerts(alertsData);
      setSystemStats(statsData);
      setLastUpdate(new Date());
      setIsConnected(true);

      // Cargar historial si hay sensor seleccionado
      if (selectedSensorId) {
        const history = iotSimulator.getSensorHistory(selectedSensorId);
        setSensorHistory(history);
      }

      // Enviar datos del simulador al backend (Redis Publisher)
      fetch("http://localhost:4000/api/sensors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statsData),
      }).catch(() => {
        console.warn("No se pudo enviar datos al servidor Redis");
      });
    } catch (error) {
      console.error("Error cargando datos IoT:", error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSensorId]);

  // --- Inicialización ---
  useEffect(() => {
    loadData();
    iotSimulator.startSimulation(5); // cada 5s
    return () => iotSimulator.stopSimulation();
  }, [loadData]);

  // --- Auto-actualización ---
  useEffect(() => {
    if (!isAutoUpdate) return;
    const id = setInterval(() => loadData(), updateInterval * 1000);
    return () => clearInterval(id);
  }, [isAutoUpdate, updateInterval, loadData]);

  // --- Acciones ---
  const selectSensor = useCallback((sensorId: string | null) => {
    setSelectedSensorId(sensorId);
    if (sensorId) {
      const history = iotSimulator.getSensorHistory(sensorId);
      setSensorHistory(history);
    } else {
      setSensorHistory(null);
    }
  }, []);

  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  const resolveAlert = useCallback((alertId: string) => {
    const success = iotSimulator.resolveAlert(alertId);
    if (success) {
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId));
    }
  }, []);

  const setFilter = useCallback((newFilter: Partial<SensorFilter>) => {
    setFilterState((prev) => ({ ...prev, ...newFilter }));
  }, []);

  const toggleAutoUpdate = useCallback(() => {
    setIsAutoUpdate((prev) => !prev);
  }, []);

  // --- Derivados ---
  const selectedSensor = useMemo(
    () =>
      selectedSensorId
        ? sensors.find((s) => s.id === selectedSensorId) || null
        : null,
    [sensors, selectedSensorId]
  );

  const filteredSensors = useMemo(() => {
    return sensors.filter((sensor) => {
      if (filter.region !== "all" && sensor.location.region !== filter.region)
        return false;
      if (filter.status !== "all" && sensor.status !== filter.status)
        return false;
      if (!filter.showInactive && !sensor.isActive) return false;
      return true;
    });
  }, [sensors, filter]);

  // --- Retorno final ---
  return {
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
  };
}
