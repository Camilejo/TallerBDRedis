import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// 👇 registro obligatorio
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure?: number;
}

interface TemperatureChartProps {
  history: SensorReading[];
}

export default function TemperatureChart({ history }: TemperatureChartProps) {
  const data = {
    labels: history.map((d) =>
      new Date(d.timestamp).toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    ),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: history.map((d) => d.temperature),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { type: "category" as const },
      y: { type: "linear" as const, beginAtZero: true },
    },
  };

  return (
    <div
      style={{
        background: "white",
        padding: "1.5rem",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        height: "400px",
      }}
    >
      <h3 style={{ marginBottom: "1rem", color: "#333" }}>
        🌡️ Temperatura vs Tiempo
      </h3>
      <div style={{ height: "calc(100% - 2.5rem)" }}>
        <Line data={data} options={options} redraw /> {/* 👈 este cambio */}
      </div>
    </div>
  );
}
