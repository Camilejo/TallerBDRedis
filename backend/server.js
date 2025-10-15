import express from "express";
import { createClient } from "redis";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Servidor HTTP + WebSocket ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // permite que tu frontend acceda
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

// --- Suscripción a canal "weather" ---
await subscriber.subscribe("weather", async (message) => {
  const data = JSON.parse(message);
  console.log("📡 Nuevo mensaje recibido en Redis:", data);

  // Emitir datos a todos los frontends conectados vía WebSocket
  io.emit("weather-update", data);
});

// --- Endpoint para recibir datos desde el simulador (Publisher) ---
app.post("/api/sensors", async (req, res) => {
  const data = req.body;

  if (!data.city) {
    return res.status(400).json({ error: "Falta el campo 'city' en los datos." });
  }

  // Normalizar nombre de ciudad: quitar tildes y convertir a minúsculas
  const normalizeCity = (name) =>
    name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina tildes
      .replace(/\s+/g, "_") // espacios -> guiones bajos
      .toLowerCase();

  const cityKey = `sensor:${normalizeCity(data.city)}`;

  try {
    await redisClient.set(cityKey, JSON.stringify(data));
    await redisClient.publish("weather", JSON.stringify(data));

    console.log(`📤 Datos almacenados/publicados para ${data.city} → ${cityKey}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error publicando datos:", error);
    res.status(500).json({ error: "Error al publicar datos en Redis." });
  }
});

// --- Endpoint para consultar los datos de una ciudad ---
app.get("/api/sensors/:city", async (req, res) => {
  const city = req.params.city;
  const key = `sensor:${city}`;

  try {
    const value = await redisClient.get(key);
    if (!value) {
      return res.status(404).json({ error: `No hay datos para ${city}` });
    }
    res.status(200).json(JSON.parse(value));
  } catch (error) {
    console.error("❌ Error consultando datos:", error);
    res.status(500).json({ error: "Error consultando Redis." });
  }
});

// --- WebSocket (Socket.io) ---
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
