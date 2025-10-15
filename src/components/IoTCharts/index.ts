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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
export { default as TemperatureChart } from "./TemperatureChart";
export { default as HumidityChart } from "./HumidityChart";
export { default as PressureChart } from "./PressureChart";