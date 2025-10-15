import { MapContainer, TileLayer } from "react-leaflet";
import HeatmapLayer from "react-leaflet-heatmap-layer-v4";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet"; // ✅ IMPORTANTE

interface Props {
  sensors: {
    lat: number;
    lon: number;
    temperature: number;
  }[];
}

export default function Heatmap({ sensors }: Props) {
  const points: [number, number, number][] = sensors.map((s) => [
    s.lat,
    s.lon,
    s.temperature / 40,
  ]);

  // ✅ Define el tipo explícito del centro
  const center: LatLngExpression = [4.65, -74.1];

  return (
    <div style={{ background: "white", padding: "1rem", borderRadius: "1rem" }}>
      <h3>🌍 Mapa de Calor de Sensores</h3>
      <MapContainer
        center={center} // ✅ sin error ahora
        zoom={11}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <HeatmapLayer
          fitBoundsOnLoad
          fitBoundsOnUpdate
          points={points}
          longitudeExtractor={(m) => m[1]}
          latitudeExtractor={(m) => m[0]}
          intensityExtractor={(m) => m[2]}
        />
      </MapContainer>
    </div>
  );
}
