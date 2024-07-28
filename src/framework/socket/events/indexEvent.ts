import { Server, Socket } from 'socket.io';
import { setupChatEvents } from './chatEvents';
import { setupChannelEvents } from './channelEvents';
import { setupUserEvents } from './userEvents';
import { setupServerVideoCallEvents } from './serverVideoCallEvents';

export const setupSocketEvents = (io: Server, socket: Socket, onlineUsers: Map<string, any>) => {
    setupChatEvents(io, socket, onlineUsers);
    setupChannelEvents(io, socket);
    setupUserEvents(io, socket, onlineUsers);
    setupServerVideoCallEvents(io,socket)
};
