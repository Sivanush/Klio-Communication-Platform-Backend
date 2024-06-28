import mongoose, { Schema, model } from "mongoose";

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