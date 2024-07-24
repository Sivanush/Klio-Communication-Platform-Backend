import { ObjectId, Types } from "mongoose";
import { User } from "../../entity/user";
import { Friends, friendsModel } from "./schema/friendsModel";
import { requestModel } from "./schema/requestSchema";
import { userI, userModel } from "./schema/userModel";

export class UserRepository {


  async findUserByEmail(email:string){
        
        console.log(await userModel.findOne({email:email}));
        
        return await userModel.findOne({email:email})
    }


    async findUserById(id:string){
        return await userModel.findById(id)
    }


    async deleteTheUserById(id:string){
        return await userModel.findByIdAndDelete(id)
    }

    async createUser(userEntity:User){
        const user = new userModel(userEntity)
        return user.save()
    }


    async userVerifying(email:string){
         await userModel.updateOne({email:email},{$set:{isVerified:true}})
    }

    async updateUser(userData:User) {
        
        return await userModel.findByIdAndUpdate(userData._id, userData);
     }


     async findUserByToken(token:string){
        return await userModel.findOne({resetToken:token,resetTokenExpire:{$gt: Date.now() }})
     }


     async updateUserBio(bio:string,userId:string){
        return await userModel.findByIdAndUpdate(userId,{$set:{bio:bio}})
     }

     async updateUserStatus(status:string,customStatus:string,userId:string){
        await userModel.findByIdAndUpdate(userId,{
            $set:{
                status:status,
                customStatus:customStatus
            }
        })        
     }

     async updateUserToOnline(userId:string){
        await userModel.findByIdAndUpdate(userId,{
            $set:{
                status:'online'
            }
        })
     }


     async updateUserToOffline(userId:string){
        await userModel.findByIdAndUpdate(userId,{
            $set:{
                status:'offline'
            }
        })
     }
}
