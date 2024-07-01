import { directChatModel } from "./schema/directChatSchema";




export class DirectChatRepository{
    
    
    
    async saveMessage(senderId:string,receiverId:string,message:string){
        const newMessage = new directChatModel({senderId,receiverId,message})
        return await newMessage.save()
    }
}