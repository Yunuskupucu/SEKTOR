import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.routes.js";
import authRoutes from "./routes/auth.route.js";
import channelsRoutes from "./routes/channels.routes.js";
import { connectDb } from "./lib/db.js";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server); // Socket.IO server'ı başlatma

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/channels", channelsRoutes);
app.use("/api/messages", messageRoutes);

// Kanal odaları ve kullanıcı bağlantısı yönetimi
let users = {};  // { user_id: socket_id }

io.on("connection", (socket) => {
    console.log("Yeni bir kullanıcı bağlandı: " + socket.id);

    // Kullanıcı kanalına katıldığında
    socket.on("joinChannel", (channel_id) => {
        socket.join(channel_id); // Kanal odasına katıl
        console.log("User joined channel:", channel_id);
    });

    // Mesaj gönderildiğinde
    socket.on("sendMessage", (messageData) => {
        const { user_id, channel_id, content } = messageData;

        // Kanal odasındaki tüm kullanıcılara mesajı gönder
        io.to(channel_id).emit("newMessage", {
            user_id,
            channel_id,
            content,
            timestamp: new Date(),
        });
    });

    // Kullanıcı bağlantısı kesildiğinde
    socket.on("disconnect", () => {
        console.log("Kullanıcı ayrıldı: " + socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
    connectDb();
});


