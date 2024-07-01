import mongoose, { ObjectId, model } from "mongoose";

export interface directChatI extends Document{
    sender: ObjectId;
    receiver: ObjectId;
    message: string;
    timestamp: Date;
}

const directChatSchema = new mongoose.Schema<directChatI>({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver:{
         type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message:{
        type:String,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
})

export const directChat = model<directChatI>('DirectChat',directChatSchema)