import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { DirectChatRepository } from '../../adapters/repository/directChatRepository';
import { ChannelChatRepository } from '../../adapters/repository/channelChatRepository';
import { UserRepository } from '../../adapters/repository/userRepository';

const directChatRepository = new DirectChatRepository();
const channelChatRepository = new ChannelChatRepository();
const userRepository = new UserRepository();
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
        
        socket.on('user-connect', async (userId) => {
            onlineUsers.set(userId, { socketId: socket.id, lastActive: Date.now() });
            await userRepository.updateUserToOnline(userId)
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

                const unReadCount = await directChatRepository.getUnReadMessageCount(senderId,receiverId)
                io.to(onlineUsers.get(receiverId)?.socketId).emit('unreadMessages',{
                    senderId,
                    count:unReadCount
                })

                const unReadCountSender = await directChatRepository.getUnReadMessageCount(receiverId, senderId);
                io.to(onlineUsers.get(senderId)?.socketId).emit('unreadMessages', {
                    senderId: receiverId,
                    count: unReadCountSender
                });

            } catch (error) {
                console.error('Error in sendMessage:', error);
                socket.emit('messageError', { error: 'Failed to send message' });
            }
        });


        socket.on('markMessagesAsRead',async({userId,otherUserId})=>{
            try {
                await directChatRepository.markMessagesAsRead(userId, otherUserId);
                const unreadCount = await directChatRepository.getUnreadMessageCount(userId,otherUserId);
                // io.to(socket.id).emit('unreadMessages', {
                //     senderId: otherUserId,
                //     count: unreadCount
                //   });
                const room = [userId, otherUserId].sort().join('-');
                io.to(room).emit('messagesRead', { readBy: userId });
            } catch (error) {
                console.error('Error in markMessagesAsRead:', error);
                socket.emit('markReadError', { error: 'Failed to mark messages as read' });
            }

        })


        socket.on('getUnreadMessageCount', async ({ userId, otherUserId }) => {
            try {
                const unreadCount = await directChatRepository.getUnreadMessageCount(userId, otherUserId);
                socket.emit('unreadMessages', {
                    senderId: otherUserId,
                    count: unreadCount
                });
            } catch (error) {
                console.error('Error in getUnreadMessageCount:', error);
                socket.emit('unreadCountError', { error: 'Failed to get unread message count' });
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

        socket.on('user-disconnect', (userId) => {
            if (onlineUsers.has(userId)) {
                onlineUsers.delete(userId);
                broadcastOnlineUsers();
            }
        });

        socket.on('disconnect', async() => {
            console.log('A User Disconnected');
            for (let [userId, userData] of onlineUsers.entries()) {
                if (userData.socketId === socket.id) {
                    onlineUsers.delete(userId);
                    await userRepository.updateUserToOffline(userId);
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