// src/api/client.ts
import axios from 'axios';

// Reemplaza esta IP por la que obtuviste con ipconfig/ifconfig:
const LOCAL_IP = '192.168.0.113';

const api = axios.create({
  baseURL: `http://${LOCAL_IP}:3000/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

export default api;
