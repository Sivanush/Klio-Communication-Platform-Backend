import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { broadcastOnlineUsers } from './utils/broadcast';
import { setupSocketEvents } from './events/indexEvent';
import dotenv from 'dotenv';
dotenv.config();

const onlineUsers = new Map();

export const setupSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.CLIENT_URL as string, 'http://localhost:4200'],
            methods: ['GET', 'POST'],
            allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
            credentials: true,
        }
    });
    

    io.on('connection', (socket) => {
        setupSocketEvents(io, socket, onlineUsers);
    });

    setInterval(() => {
        const now = Date.now();
        for (const [userId, userData] of onlineUsers.entries()) {
            if (now - userData.lastActive > 60000) {
                onlineUsers.delete(userId);
            }
        }
        broadcastOnlineUsers(io, onlineUsers);
    }, 30000);
};
