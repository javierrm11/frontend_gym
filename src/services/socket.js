// src/services/socket.js
import { io } from "socket.io-client";

const socket = io(process.env.VUE_APP_BASE_URL, {
  autoConnect: false,
  transports: ['websocket', 'polling']
});

export default socket;