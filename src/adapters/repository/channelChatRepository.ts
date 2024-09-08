import { channelChatModel } from "./schema/channelChatSchema";

export class ChannelChatRepository {
    constructor() {}

    getChannelMessages(channelId: string, page: number = 1, pageSize: number = 50) {
        return channelChatModel
            .find({ channelId: channelId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize)
            .select('sender message createdAt fileType thumbnailUrl')
            .populate('sender', 'username image')
            .lean();
    }

    sendMessage(userId: string, channelId: string, message: string, fileType?:string, thumbnailUrl?:string) {
        const newMessage = new channelChatModel({
            sender: userId,
            channelId: channelId,
            message: message,
            fileType: fileType,
            thumbnailUrl: thumbnailUrl
        });
        newMessage.save();
        return newMessage.populate('sender');
    }
}
