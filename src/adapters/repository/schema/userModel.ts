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
    timestamps:Date,
    bio:string,
    status:string,
    customStatus:string,
    banner:string
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
    banner:{
        type:String,
        default:'https://res.cloudinary.com/dgpcd5c0d/image/upload/v1731437459/CMD/nh83k1roaiczbnkgrgfv.webp',
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    bio:{
        type:String,
        default:''
    },
    status:{
        type:String,
        enum: ['online', 'idle', 'dnd', 'invisible', 'offline'],
        default: 'offline'
    },
    customStatus:{
        type:String,
        default:''
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
},{
    timestamps:true
})

export const userModel = model<userI>('User',userSchema)