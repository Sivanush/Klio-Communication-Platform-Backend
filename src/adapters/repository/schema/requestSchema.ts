import mongoose, { Schema, model } from "mongoose";

const requestSchema = new Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})


export const requestModel = model('Request',requestSchema)