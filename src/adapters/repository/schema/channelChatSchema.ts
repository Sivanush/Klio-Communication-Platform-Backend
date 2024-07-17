import mongoose, { model, ObjectId } from "mongoose"


interface ChannelChatI {
    sender: ObjectId,
    channelId: ObjectId,
    message: string
    timestamp: Date;
}

const channelChatSchema = new mongoose.Schema<ChannelChatI>({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const channelChatModel = model<ChannelChatI>('Channel-Chat',channelChatSchema) 