import { Server, Socket } from 'socket.io';
import { DirectChatRepository } from '../../../adapters/repository/directChatRepository';
import cloudinary from '../../../utils/cloudinary';

const directChatRepository = new DirectChatRepository();

export const setupChatEvents = (io: Server, socket: Socket, onlineUsers: Map<string, any>) => {
    socket.on('joinChat', ({ senderId, receiverId }) => {
        const room = [senderId, receiverId].sort().join('-');
        socket.join(room);
        directChatRepository.getMessages(senderId, receiverId).then((messages) => {
            socket.emit('allMessages', messages);
        });
    });

    socket.on('sendMessage', async ({ senderId, receiverId, message ,fileUrl, fileType}) => {
        const room = [senderId, receiverId].sort().join('-');

        try {
            let savedMessage;

            if (fileUrl) {    
                savedMessage = await directChatRepository.sendMessage(senderId, receiverId, `[${fileType}]${fileUrl}`, fileType);
            } else {
                savedMessage = await directChatRepository.sendMessage(senderId, receiverId, message);
            }
            const updatedMessage = await directChatRepository.getMessageById(savedMessage._id as unknown as string);
            io.to(room).emit('message', updatedMessage);

            const unReadCount = await directChatRepository.getUnReadMessageCount(senderId, receiverId);
            io.to(onlineUsers.get(receiverId)?.socketId).emit('unreadMessages', {
                senderId,
                count: unReadCount
            });

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

    socket.on('markMessagesAsRead', async ({ userId, otherUserId }) => {
        try {
            await directChatRepository.markMessagesAsRead(userId, otherUserId);
            const unreadCount = await directChatRepository.getUnreadMessageCount(userId, otherUserId);

            const room = [userId, otherUserId].sort().join('-');
            io.to(room).emit('messagesRead', { readBy: userId });
        } catch (error) {
            console.error('Error in markMessagesAsRead:', error);
            socket.emit('markReadError', { error: 'Failed to mark messages as read' });
        }
    });

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
};
