import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import { connectDb } from "./lib/db.js";
import { handleSendMessage } from "./lib/handleSendMessage.js";

import passport from "./lib/passport.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(passport.initialize());
app.get("/health", (_, res) => res.send("OK"));

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
// SOCKET.IO
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("joinChannel", (channel_id) => {
    socket.join(channel_id);
    console.log(`📡 Joined channel: ${channel_id}`);
  });

  socket.on("sendMessage", async (data) => {
    const { user_id, channel_id, content } = data;
    try {
      const fullMessage = await handleSendMessage({ user_id, channel_id, content });
      io.to(channel_id).emit("newMessage", fullMessage);
    } catch (error) {
      console.error("❌ Socket üzerinden mesaj gönderme hatası:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

// Socket'i route'lara aktar
app.set("io", io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDb();
});
