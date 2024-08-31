import mongoose, { model, Types } from "mongoose";


export interface IComment {
    postId:Types.ObjectId
    content: string;
    author: Types.ObjectId;
    timestamp: Date;
}

export interface IPost extends Document {
    content: string;
    author: Types.ObjectId;
    mediaUrl?: string;
    mediaType?: string;
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];
    timestamp: Date;
}





const postSchema = new mongoose.Schema<IPost>({
    content:{
        type:String
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    },
    mediaUrl:{
        type : String
    },
    mediaType:{
        type: String
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
}) 



export const postModel = model('Post',postSchema)