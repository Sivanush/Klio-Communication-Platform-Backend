import { Server, Socket } from 'socket.io';
import { UserRepository } from '../../../adapters/repository/userRepository';
import { FriendsRepository } from '../../../adapters/repository/friendsRepository';
import { broadcastOnlineUsers } from '../utils/broadcast';

const userRepository = new UserRepository();
const friendsRepository = new FriendsRepository();

export const setupUserEvents = (io: Server, socket: Socket, onlineUsers: Map<string, any>) => {
    socket.on('user-connect', async (userId) => {
        console.log('A User Connected');
        onlineUsers.set(userId, { socketId: socket.id, lastActive: Date.now() });
        await userRepository.updateUserToOnline(userId);
        broadcastOnlineUsers(io, onlineUsers);
    });

    socket.on('getFriendsStatus', async (userId) => {
        try {
            const friends = await friendsRepository.getAllFriendsByUserId(userId);
            socket.emit('friendsStatus', friends);
        } catch (error) {
            console.error('Error getting friends status:', error);
        }
    });

    socket.on('sendFriendRequest', ({ senderId, receiverId }) => {
        console.log(`Friend request sent from ${senderId} to ${receiverId}`);
        console.log(onlineUsers);
        const receiverSocketId = onlineUsers.get(receiverId)?.socketId;
        if (receiverSocketId) {
            console.log(`Emitting newFriendRequest to ${receiverId}`);
            io.to(receiverSocketId).emit('newFriendRequest', { senderId });
        } else {
            console.log(`Receiver ${receiverId} not found in online users`);
        }
    });

    socket.on('heartbeat', (userId) => {
        if (onlineUsers.has(userId)) {
            onlineUsers.get(userId).lastActive = Date.now();
        }
    });

    socket.on('user-disconnect', (userId) => {
        if (onlineUsers.has(userId)) {
            onlineUsers.delete(userId);
            broadcastOnlineUsers(io, onlineUsers);
        }
    });

    socket.on('disconnect', async () => {
        console.log('A User Disconnected');
        for (let [userId, userData] of onlineUsers.entries()) {
            if (userData.socketId === socket.id) {
                onlineUsers.delete(userId);
                await userRepository.updateUserToOffline(userId);
                break;
            }
        }
        broadcastOnlineUsers(io, onlineUsers);
    });
};
