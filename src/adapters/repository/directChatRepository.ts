    import { directChatModel } from "./schema/directChatSchema";




    export class DirectChatRepository{
        
        
        
        async sendMessage(senderId:string,receiverId:string,message:string){
            const newMessage = new directChatModel({senderId,receiverId,message})
            return await newMessage.save()
        }

        async getMessages(senderId: string, receiverId: string) {
            const result = await directChatModel.find({
                $or: [
                    { senderId: senderId, receiverId: receiverId },
                    { senderId: receiverId, receiverId: senderId }
                ]
            }).sort({ timestamp: 1 }).populate('senderId receiverId')
            return result
        }

        async getMessageById(id:string){       
            return await directChatModel.findById(id).populate('senderId receiverId')
        }
    }