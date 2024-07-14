
import { Schema, model, Document, Types } from 'mongoose';

export interface IChannel extends Document {
    name: string;
    type: 'text' | 'voice' | 'video';
    server: Types.ObjectId;
    category: Types.ObjectId;
    createdAt: Date;
}

const ChannelSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'voice', 'video'],
        required: true
    },
    server: {
        type: Schema.Types.ObjectId,
        ref: 'Server',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
},{
    timestamps:true
})

export const channelModel = model<IChannel>('Channel', ChannelSchema);