import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { DirectChatRepository } from '../../adapters/repository/directChatRepository';
import { ChannelChatRepository } from '../../adapters/repository/channelChatRepository';

const directChatRepository = new DirectChatRepository();
const channelChatRepository = new ChannelChatRepository();
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



        socket.on('joinChannel',async({userId,channelId})=>{
            socket.join(`channel-${channelId}`)
            const messages = await channelChatRepository.getChannelMessages(channelId)
            socket.emit('allMessages',messages)
        })  


        socket.on('getMoreMessages',async({userId,channelId,page,pageSize})=>{
            try {
                console.log(userId,channelId,page,pageSize);
                
                const messages = await channelChatRepository.getChannelMessages(channelId, page, pageSize);
                socket.emit('paginatedMessages', messages);
                
              } catch (error) {
                console.error('Error fetching paginated messages:', error);
              }
        })

        socket.on('leaveChannel',({channelId})=>{
            socket.leave(`channel-${channelId}`)
        })  

        socket.on('sendChannelMessage',async({userId,channelId,message})=>{
            try {
                
                const savedMessage = await channelChatRepository.sendMessage(userId,channelId,message)
                io.to(`channel-${channelId}`).emit('channelMessage',savedMessage)
            } catch (err) {
                console.log("Error in Channel Send Message ",err );
                throw new Error("Something Went Wrong, Try Again");
            }

        })


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