import { io } from "socket.io-client";

const socket = io("http://localhost:5001", {
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("✅ Socket bağlantısı kuruldu:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket bağlantı hatası:", err.message);
});

export default socket;
