import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

interface SensorReading {
  timestamp: string;
  temperature: number;
  humidity: number;
  pressure?: number;
}

interface Props {
  history: SensorReading[];
}

export default function HumidityChart({ history }: Props) {
  const data = {
    labels: history.map((d) => {
      const date = new Date(d.timestamp);
      return date.toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }),
    datasets: [
      {
        label: "Humedad (%)",
        data: history.map((d) => d.humidity),
        borderColor: "blue",
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "top" as const },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Humedad (%)" },
      },
      x: { title: { display: true, text: "Tiempo" } },
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
      <h3 style={{ margin: "0 0 1rem 0", color: "#333" }}>
        💧 Humedad vs Tiempo
      </h3>
      <div style={{ height: "calc(100% - 2.5rem)" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
