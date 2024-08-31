import mongoose, { ObjectId, model } from "mongoose";

export interface directChatI extends Document{
    senderId: ObjectId;
    receiverId: ObjectId;
    message: string;
    timestamp: Date;
    isRead:boolean,
    fileType?: 'image' | 'video'|'text',
    thumbnailUrl:String
}

const directMessageSchema = new mongoose.Schema<directChatI>({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiverId:{
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message:{
        type:String,
        required:true
    },
    isRead:{
        type:Boolean,
        default:false
    },
    fileType: {
        type: String,
        default:'text',
        enum: ['image', 'video', 'text'],
    },
    thumbnailUrl:{
        type:String
    }
    
},{
    timestamps:true
})

export const directChatModel = model<directChatI>('Direct-Chat-Message',directMessageSchema)