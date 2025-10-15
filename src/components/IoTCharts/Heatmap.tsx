// 📄 src/components/IoTCharts/Heatmap.tsx
import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap, Popup, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";

declare global {
  interface LeafletHeatLayerOptions {
    radius?: number;
    blur?: number;
    maxZoom?: number;
    max?: number;
    minOpacity?: number;
    gradient?: Record<number, string>;
  }

  namespace L {
    function heatLayer(
      latlngs: [number, number, number?][],
      options?: LeafletHeatLayerOptions
    ): any;
  }
}

interface HeatmapLayerProps {
  points: [number, number, number?][];
}

const HeatmapLayer: React.FC<HeatmapLayerProps> = ({ points }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !points.length) return;

    const heat = L.heatLayer(points, {
      radius: 30,
      blur: 20,
      maxZoom: 17,
      max: 1.0,
      minOpacity: 0.3,
      gradient: {
        0.0: "blue",
        0.2: "cyan",
        0.4: "lime",
        0.6: "yellow",
        0.8: "orange",
        1.0: "red",
      },
    });

    heat.addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points]);

  return null;
};

interface SensorData {
  lat: number;
  lon: number;
  temperature: number;
  humidity?: number;
  location?: string;
}

interface HeatmapProps {
  sensors: SensorData[];
}

const Heatmap: React.FC<HeatmapProps> = ({ sensors }) => {
  // Normalizar temperatura para el heatmap (0-1)
  const normalizeTemp = (temp: number) => {
    const minTemp = 0;
    const maxTemp = 40;
    return Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));
  };

  // Convertir sensores a formato de heatmap
  const heatmapPoints = sensors.map<[number, number, number]>((s) => [
    s.lat,
    s.lon,
    normalizeTemp(s.temperature),
  ]);


  // Si no hay sensores, usar datos por defecto
  const displayPoints = heatmapPoints.length > 0 ? heatmapPoints : [
    [4.65, -74.1, 0.5],
    [4.7, -74.05, 0.7],
    [4.6, -74.15, 0.6],
  ];

  return (
    <div>
      <h3 style={{ marginBottom: "1rem", color: "#333" }}>
        🗺️ Mapa de Calor - Temperatura
      </h3>
      <div
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={[4.65, -74.1]}
          zoom={12}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatmapLayer points={displayPoints} />

          {sensors.map((sensor, idx) => (
            <CircleMarker
              key={idx}
              center={[sensor.lat, sensor.lon]}
              radius={8}
              fillColor="#fff"
              fillOpacity={0.9}
              color="#333"
              weight={2}
            >
              <Popup>
                <div style={{ minWidth: "120px" }}>
                  <strong>Sensor {idx + 1}</strong>
                  <br />
                  🌡️ Temp: {sensor.temperature.toFixed(1)}°C
                  {sensor.humidity !== undefined && (
                    <>
                      <br />
                      💧 Humedad: {sensor.humidity.toFixed(1)}%
                    </>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Heatmap;