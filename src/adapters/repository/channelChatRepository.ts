import { channelChatModel } from "./schema/channelChatSchema";



export class ChannelChatRepository{
  
    constructor(){}
    getChannelMessages(channelId: string) {
        return channelChatModel.find({channelId:channelId}).sort({createdAt:1}).populate('sender')
    }
    sendMessage(userId: string, channelId: string, message: string) {

        
        
        const newMessage = new channelChatModel({
            sender: userId,
            channelId: channelId,
            message: message
        })
        newMessage.save()
        return newMessage.populate('sender')
    }
   
}