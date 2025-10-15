import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

interface Props {
  history: any[];
}

export default function TemperatureChart({ history }: Props) {
  return (
    <div style={{ background: "white", padding: "1rem", borderRadius: "1rem" }}>
      <h3>🌡️ Temperatura vs Tiempo</h3>
      <Line
        data={{
          labels: history.map((d) => d.timestamp),
          datasets: [
            {
              label: "Temperatura (°C)",
              data: history.map((d) => d.temperature),
              borderColor: "red",
              borderWidth: 2,
            },
          ],
        }}
      />
    </div>
  );
}
