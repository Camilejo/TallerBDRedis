import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

interface Props {
  history: any[];
}

export default function HumidityChart({ history }: Props) {
  return (
    <div style={{ background: "white", padding: "1rem", borderRadius: "1rem" }}>
      <h3>💧 Humedad vs Tiempo</h3>
      <Line
        data={{
          labels: history.map((d) => d.timestamp),
          datasets: [
            {
              label: "Humedad (%)",
              data: history.map((d) => d.humidity),
              borderColor: "blue",
              borderWidth: 2,
            },
          ],
        }}
      />
    </div>
  );
}
