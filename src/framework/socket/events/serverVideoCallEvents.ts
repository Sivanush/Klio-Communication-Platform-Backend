import { Server, Socket } from "socket.io";

const rooms = new Map();

export const setupServerVideoCallEvents = (io: Server, socket: Socket) => {
  const rooms = new Map();


  socket.on('join-room', (roomId, peerId) => {
    console.log(`User ${peerId} (socket ${socket.id}) joining room ${roomId}`);
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set());
    }
    rooms.get(roomId).add(peerId);

    // Notify others in the room
    console.log(`Notifying others in room ${roomId} about new user ${peerId}`);
    socket.to(roomId).emit('user-joined', peerId);

    // Send list of existing peers to the new user
    const peersInRoom = Array.from(rooms.get(roomId)).filter(id => id !== peerId);
    console.log(`Sending existing peers to ${peerId}:`, peersInRoom);
    socket.emit('existing-peers', peersInRoom);

    console.log(`Room ${roomId} now has peers:`, Array.from(rooms.get(roomId)));
  });

  socket.on('leave-room', (roomId, peerId) => {
    socket.leave(roomId);
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(peerId);
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId);
      }
    }
    socket.to(roomId).emit('user-left', peerId);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    rooms.forEach((peers, roomId) => {
      peers.forEach((peerId: string) => {
        if (socket.rooms.has(roomId)) {
          socket.to(roomId).emit('user-left', peerId);
          peers.delete(peerId);
        }
      });
      if (peers.size === 0) {
        rooms.delete(roomId);
      }
    });
  });


}   
