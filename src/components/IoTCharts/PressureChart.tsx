import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

interface Props {
  history: any[];
}

export default function PressureChart({ history }: Props) {
  return (
    <div style={{ background: "white", padding: "1rem", borderRadius: "1rem" }}>
      <h3>🌪️ Presión vs Tiempo</h3>
      <Line
        data={{
          labels: history.map((d) => d.timestamp),
          datasets: [
            {
              label: "Presión (hPa)",
              data: history.map((d) => d.pressure),
              borderColor: "green",
              borderWidth: 2,
            },
          ],
        }}
      />
    </div>
  );
}
