import mongoose, { model, Mongoose, Types } from "mongoose";


export interface storyI extends Document{
    userId:Types.ObjectId,
    mediaUrl:string,
    createdAt:Date,
    expiresAt:Date
}


const storySchema = new mongoose.Schema<storyI>({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    mediaUrl: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    expiresAt: { 
        type: Date, 
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
})



export const storyModel = model('Story',storySchema)