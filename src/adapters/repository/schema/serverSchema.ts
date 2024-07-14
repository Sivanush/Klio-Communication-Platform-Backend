import { model, Schema } from "mongoose";
import {v4 as uuidv4} from 'uuid';

interface IServer extends Document {
    id: string;
    name: string;
    image: string;
    owner: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }

const serverSchema = new Schema<IServer>({
    id: { 
        type: String, 
        default: uuidv4, 
        unique: true 
    },
    name:{
        type: String,
        required: true
    },
    image:{
        type: String,
        default:''
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    },
},{
    timestamps:true
})

export const serverModel = model('Server',serverSchema)