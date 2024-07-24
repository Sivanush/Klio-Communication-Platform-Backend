import mongoose, { ObjectId, model } from "mongoose";

export interface directChatI extends Document{
    senderId: ObjectId;
    receiverId: ObjectId;
    message: string;
    timestamp: Date;
    isRead:boolean
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
    }
    
},{
    timestamps:true
})

export const directChatModel = model<directChatI>('Direct-Chat-Message',directMessageSchema)