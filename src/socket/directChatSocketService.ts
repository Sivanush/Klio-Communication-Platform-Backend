import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { Chat } from '../entity/directChat';

export const setupSocket = (server:HttpServer)=>{
    const io = new Server(server,{
        cors:{
            origin:"*"
        }
    })


    io.on('connection',(socket)=>{
        console.log('A User Connected');

        socket.on('joinChat',({userId,friendId})=>{
            const room = [userId,friendId].sort().join('-')
            socket.join(room)
        })


        socket.on('sendMessage',async({userId,friendId,message})=>{
            const chatMessage = new Chat(userId,friendId,message)
            
            const room = [userId,friendId].sort().join('-')
            io.to(room).emit('message',chatMessage)
        })


        socket.on('disconnect',()=>{
            console.log('A User Disconnected');
        })
        
    })
}