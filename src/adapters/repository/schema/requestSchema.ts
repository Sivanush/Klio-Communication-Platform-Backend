import mongoose, { ObjectId, Schema, model } from "mongoose";

interface requestSchemeI extends Document{
    sender:ObjectId
    receiver:ObjectId
}

const requestSchema = new Schema<requestSchemeI>({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }

})


export const requestModel = model<requestSchemeI>('Request',requestSchema)