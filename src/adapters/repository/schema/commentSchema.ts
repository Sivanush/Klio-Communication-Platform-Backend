import mongoose, { model } from "mongoose";
import { IComment } from "./postSchema";

const commentSchema = new mongoose.Schema<IComment>({
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

export const CommentModel = model('Comment', commentSchema);
