import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { DirectChatRepository } from '../../adapters/repository/directChatRepository';

const directChatRepository = new DirectChatRepository();
const onlineUsers = new Map();

export const setupSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('A User Connected');

        socket.on('user-connect', (userId) => {
            onlineUsers.set(userId, { socketId: socket.id, lastActive: Date.now() });
            broadcastOnlineUsers();
        });

        socket.on('joinChat', ({ senderId, receiverId }) => {
            const room = [senderId, receiverId].sort().join('-');
            socket.join(room);

            directChatRepository.getMessages(senderId, receiverId).then((messages) => {
                socket.emit('allMessages', messages);
            });
        });

        socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
            const room = [senderId, receiverId].sort().join('-');

            try {
                const savedMessage = await directChatRepository.sendMessage(senderId, receiverId, message);
                const updatedMessage = await directChatRepository.getMessageById(savedMessage._id as unknown as string);
                io.to(room).emit('message', updatedMessage);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        });

        socket.on('heartbeat', (userId) => {
            if (onlineUsers.has(userId)) {
                onlineUsers.get(userId).lastActive = Date.now();
            }
        });

        socket.on('disconnect', () => {
            console.log('A User Disconnected');
            for (let [userId, userData] of onlineUsers.entries()) {
                if (userData.socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            broadcastOnlineUsers();
        });
    });

    function broadcastOnlineUsers() {
        const onlineUserIds = Array.from(onlineUsers.keys());
        io.emit('online-users', onlineUserIds);
    }

    setInterval(() => {
        const now = Date.now();
        for (const [userId, userData] of onlineUsers.entries()) {
            if (now - userData.lastActive > 60000) {
                onlineUsers.delete(userId);
            }
        }
        broadcastOnlineUsers();
    }, 30000);
};