import mongoose, { model, ObjectId } from "mongoose"


interface ChannelChatI { 
    sender: ObjectId,
    channelId: ObjectId,
    message: string,
    fileType?: 'image' | 'video'|'text'
    timestamp: Date,
    thumbnailUrl:string
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
    },
    fileType: {
        type: String,
        default:'text',
        enum: ['image', 'video', 'text'],
    },
    thumbnailUrl:{
        type:String
    }
}, {
    timestamps: true
})

export const channelChatModel = model<ChannelChatI>('Channel-Chat',channelChatSchema) 