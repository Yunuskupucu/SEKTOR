import { io } from 'socket.io-client';

export let socket = null;

export function initSocket(origin) {
   console.log(" Socket origin:", origin);
  if (socket?.disconnect) {
    socket.disconnect();
  }
  socket = io(origin, {
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('Socket bağlantısı kuruldu:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error(' Socket bağlantı hatası:', err.message);
  });
}
