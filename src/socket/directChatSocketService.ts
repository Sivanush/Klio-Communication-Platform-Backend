import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Chat } from '../entity/directChat';
import { DirectChatUseCase } from '../usecase/directChatUseCase';
import { DirectChatRepository } from '../adapters/repository/directChatRepository';


const directChatRepository = new DirectChatRepository();
const directChatUseCase = new DirectChatUseCase(directChatRepository);

export const setupSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:4200',
            methods: ["GET", "POST"]
        }
    })


    io.on('connection', (socket) => {
        console.log('A User Connected');

        socket.on('joinChat', ({ senderId, receiverId }) => {
            const room = [senderId, receiverId].sort().join('-')
            socket.join(room)
        })

        socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
            const room = [senderId, receiverId].sort().join('-')

            try {
                await directChatUseCase.executeDirectMessage(senderId, receiverId, message)
                io.to(room).emit('message', { senderId, receiverId, message })
            } catch (error) {
                console.error('Error sending message:', error);
            }
        })


        socket.on('disconnect', () => {
            console.log('A User Disconnected');
        })

    })
}