import express from "express";
import { createClient } from "redis";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // para leer JSON de requests

// --- Configuración del servidor HTTP + Socket.io ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// --- Conexión a Redis ---
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
const subscriber = redisClient.duplicate();

await redisClient.connect();
await subscriber.connect();

console.log("✅ Conectado a Redis");

// --- Canal de suscripción ---
await subscriber.subscribe("weather", (message) => {
  const data = JSON.parse(message);
  console.log("📡 Nuevo mensaje desde Redis:", data);
  io.emit("weather-update", data); // Enviar a todos los frontends conectados
});

// --- Endpoint para recibir datos desde el simulador (frontend) ---
app.post("/api/sensors", async (req, res) => {
  const data = req.body;

  // Publicar los datos en el canal "weather" de Redis
  await redisClient.publish("weather", JSON.stringify(data));

  console.log("📤 Datos publicados en Redis:", data);
  res.status(200).json({ success: true });
});

// --- Socket.io ---
io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado al WebSocket");

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

// --- Iniciar servidor ---
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor IoT corriendo en http://localhost:${PORT}`);
});
