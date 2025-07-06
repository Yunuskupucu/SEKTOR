// ✅ BACKEND: index.js
import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';

import path from 'path';

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.routes.js";
import channelRoutes from "./routes/channel.routes.js";
import { connectDb } from "./lib/db.js";

import Message from "./models/message.model.js";
import User from "./models/user.model.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// SOCKET.IO
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("joinChannel", (channel_id) => {
    socket.join(channel_id);
    console.log(`Joined channel: ${channel_id}`);
  });

  socket.on("sendMessage", async (data) => {
    const { user_id, channel_id, content } = data;
    try {
      const newMessage = await Message.create({ user_id, channel_id, content });
      const fullMessage = await Message.findByPk(newMessage.id, {
        include: [{ model: User, attributes: ["fullname"] }],
      });
      io.to(channel_id).emit("newMessage", fullMessage);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected:", socket.id);
  });
});

app.set("io", io);
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDb();
});
