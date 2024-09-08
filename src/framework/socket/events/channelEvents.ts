import { Server, Socket } from 'socket.io';
import { ChannelChatRepository } from '../../../adapters/repository/channelChatRepository';

const channelChatRepository = new ChannelChatRepository();

export const setupChannelEvents = (io: Server, socket: Socket) => {
    socket.on('joinChannel', async ({ userId, channelId }) => {
        socket.join(`channel-${channelId}`);
        const messages = await channelChatRepository.getChannelMessages(channelId);
        socket.emit('allMessages', messages);
    });

    socket.on('getMoreMessages', async ({ userId, channelId, page, pageSize }) => {
        try {
            const messages = await channelChatRepository.getChannelMessages(channelId, page, pageSize);
            socket.emit('paginatedMessages', messages);
        } catch (error) {
            console.error('Error fetching paginated messages:', error);
        }
    });

    socket.on('leaveChannel', ({ channelId }) => {
        socket.leave(`channel-${channelId}`);
    });

    socket.on('sendChannelMessage', async ({ userId, channelId, message, fileUrl, fileType, thumbnailUrl}) => {
        try {
            console.log('❌❌❌❌❌');
            console.log(thumbnailUrl);
            
            
            let savedMessage

            if (fileUrl) {    
                savedMessage = await channelChatRepository.sendMessage(userId, channelId, `[${fileType}]${fileUrl}`, fileType, thumbnailUrl);
            } else {
                savedMessage = await channelChatRepository.sendMessage(userId, channelId, message);
            }


            // const savedMessage = await channelChatRepository.sendMessage(userId, channelId, message);
            io.to(`channel-${channelId}`).emit('channelMessage', savedMessage);
        } catch (err) {
            console.log("Error in Channel Send Message ", err);
            throw new Error("Something Went Wrong, Try Again");
        }
    });
};
