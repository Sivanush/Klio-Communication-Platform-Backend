import { Document, Schema, model } from "mongoose"

export interface userI extends Document{
    username:string
    email:string
    password:string
    isVerified:boolean
    image:string
    isBlocked:boolean 
    isAdmin:boolean
    resetToken:string|undefined,
    resetTokenExpire:number|undefined,
    isGoogle:boolean
}

const userSchema = new Schema<userI>({
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
        default:'https://www.shutterstock.com/image-vector/vector-flat-illustration-grayscale-avatar-600nw-2281862025.jpg'
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    resetToken: { 
        type: String 
    },
    resetTokenExpire: { 
        type: Number 
    },
    isGoogle:{
        type:Boolean,
        default:false
    }
})

export const userModel = model<userI>('User',userSchema)