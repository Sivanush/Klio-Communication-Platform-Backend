import { Document, Schema, model } from "mongoose"

export interface userI extends Document{
    username:string
    email:string
    password:string
    isVerified:boolean
    image:string
    isBlocked:boolean 
    isAdmin:boolean
}

const UserSchema = new Schema<userI>({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    image:{
        type:String,
        default:''
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
})

export const userModel = model<userI>('User',UserSchema)