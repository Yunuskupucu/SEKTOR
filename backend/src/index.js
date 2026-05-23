import { startJobPostExpirationCron } from '../jobPostExpirationCron.js';
// Günü dolan ilanları expired yapan cron job'u başlat
startJobPostExpirationCron();
import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
// import path from "path";
// import { fileURLToPath } from "url";
import { getOrCreateJobChannelId } from './lib/jobChannel.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.routes.js';
import channelRoutes from './routes/channel.routes.js';
import jobRoutes from './routes/job.routes.js';
import { connectDb } from './lib/db.js';
import { handleSendMessage } from './lib/handleSendMessage.js';
import { handleAiReply } from './lib/handleAiReply.js';
import passport from './lib/passport.js';
dotenv.config();

function normalizeOrigin(url) {
  if (!url || typeof url !== 'string') return null;
  const t = url.trim();
  if (!t) return null;
  try {
    const withScheme = /^https?:\/\//i.test(t) ? t : `https://${t}`;
    return new URL(withScheme).origin;
  } catch {
    return null;
  }
}

function buildAllowedOrigins() {
  const list = [
    'http://localhost:5173',
    // 'https://sektor.onrender.com',
    // 'https://sektor-app.web.app',
  ];
  const add = (o) => {
    if (o && !list.includes(o)) list.push(o);
  };
  add(normalizeOrigin(process.env.FRONTEND_URL));
  if (process.env.CORS_ORIGINS) {
    for (const part of process.env.CORS_ORIGINS.split(',')) {
      add(normalizeOrigin(part.trim()));
    }
  }
  return list;
}

const allowedOrigins = buildAllowedOrigins();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: allowedOrigins, credentials: true },
});

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(passport.initialize());
app.get('/health', (_, res) => res.send('OK'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/channels', channelRoutes);
app.use('/api/messages', messageRoutes);

app.use('/api/jobs', jobRoutes);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});
// SOCKET.IO
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('joinChannel', (channel_id) => {
    const room = String(channel_id);
    socket.join(room);

  });

  socket.on('leaveChannel', (channel_id) => {
    const room = String(channel_id);
    socket.leave(room);
    console.log(`📴 Left channel: ${room}`);
  });

  socket.on('sendMessage', async (data) => {
    console.log("📨 BACKEND SOCKET sendMessage geldi:", data);
    const { user_id, channel_id, content } = data;

    try {
      const room = String(channel_id);

      const fullMessage = await handleSendMessage({ user_id, channel_id, content });
console.log("🧪 SOCKET FULL MESSAGE:", fullMessage?.toJSON?.() || fullMessage);

      io.to(room).emit('newMessage', fullMessage);

      console.log('✅ handleSendMessage tamamlandı, status:', fullMessage.status);
      console.log('🔍 @ai var mı:', /@ai\b/i.test(content));

      if (/@ai\b/i.test(content) && fullMessage.status !== 'removed') {
        console.log('🤖 handleAiReply başlıyor...');
        try {
          await handleAiReply({
            channel_id,
            question: content,
            io,
            req: null,
            historySize: 10,
          });
          console.log('✅ handleAiReply tamamlandı');
        } catch (aiErr) {
          console.error('❌ handleAiReply içi hata:', aiErr.message, aiErr.stack);
        }
      }
    } catch (error) {
      console.error('❌ Socket mesaj hatası:', error.message, error.stack);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// Socket'i route'lara aktarıyoruz
app.set('io', io);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📎 CORS izinli kökenler: ${allowedOrigins.join(', ')}`);

  connectDb()
    .then(async () => {
      //  İş İlanları kanalını DB'den bul/oluştur ve cache'e al
      const jobChannelId = await getOrCreateJobChannelId();
      console.log(`📌 Job channel ready (id: ${jobChannelId})`);
    })
    .catch((err) => {
      console.error('❌ Startup error (DB or job channel):', err);
      process.exit(1);
    });
});
