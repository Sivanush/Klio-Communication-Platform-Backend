    import { directChatModel } from "./schema/directChatSchema";




    export class DirectChatRepository{
        
        
        
        async sendMessage(senderId:string,receiverId:string,message:string,fileType?:string,thumbnailUrl?:string){
            
            const newMessage = new directChatModel({senderId,receiverId,message,fileType,thumbnailUrl})
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

        async getUnReadMessageCount(senderId:string,receiverId:string){
            return await directChatModel.countDocuments({senderId:senderId,receiverId:receiverId,read:false})
        }

        async markMessagesAsRead(userId:string, otherUserId:string){
            await directChatModel.updateMany({senderId:otherUserId,receiverId:userId},{$set:{isRead:true}})
        }

        async getUnreadMessageCount(userId:string, otherUserId:string){
            return await directChatModel.countDocuments({senderId:otherUserId,receiverId:userId,isRead:false})
        }
    }