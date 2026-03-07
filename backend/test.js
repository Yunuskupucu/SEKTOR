import { io } from "socket.io-client";
// kaldırılacak: sadece test amaçlıdır
const socket = io("http://127.0.0.1:5001", {
  transports: ["polling", "websocket"],
  withCredentials: false,
  timeout: 10000,
});

socket.on("connect", () => {
  console.log("✅ connected:", socket.id);

  socket.emit("joinChannel", "1");

  socket.emit("sendMessage", {
    user_id: 1,
    channel_id: 1,
    content: "AI kapalı test",
    aiEnabled: false,
  });

  setTimeout(() => {
    socket.emit("sendMessage", {
      user_id: 1,
      channel_id: 1,
      content: "AI açık test",
      aiEnabled: true,
    });
  }, 1000);
});

socket.on("newMessage", (m) => console.log("📨 newMessage:", m?.content));
socket.on("aiResponse", (m) => console.log("🤖 aiResponse:", m?.content));
socket.on("connect_error", (e) => console.log("❌ connect_error:", e.message));
