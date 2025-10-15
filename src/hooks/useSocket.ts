import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SensorReading } from '../types/IoT';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [latestReading, setLatestReading] = useState<SensorReading | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on('connect', () => {
      console.log('✅ Conectado a Socket.IO');
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('❌ Desconectado de Socket.IO');
      setConnected(false);
    });

    socketInstance.on('sensor-data', (data: SensorReading) => {
      console.log('📊 Datos recibidos:', data);
      setLatestReading(data);
    });

    socketInstance.on('error', (error) => {
      console.error('❌ Error en socket:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return { socket, connected, latestReading };
}

// Hook alternativo para solo escuchar eventos
export function useSensorData() {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { connected, latestReading } = useSocket();

  useEffect(() => {
    if (latestReading) {
      setReadings((prev) => {
        const newReadings = [...prev, latestReading];
        // Mantener solo las últimas 20 lecturas
        return newReadings.slice(-20);
      });
      setIsLoading(false);
    }
  }, [latestReading]);

  return { readings, isLoading, connected };
}