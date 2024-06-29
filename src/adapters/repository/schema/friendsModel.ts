import mongoose, { ObjectId, Schema, Types, model } from "mongoose";


export interface Friends {
    userId: string;
    friends: Types.Array<string>;
    save: () => Promise<void>;
  }


const friendsSchema = new Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    friends:[{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }]
})


export const friendsModel = model('Friends',friendsSchema)