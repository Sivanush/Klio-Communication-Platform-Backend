import { ObjectId } from "mongoose";
import { User } from "../../entity/user";
import { Friends, friendsModel } from "./schema/friendsModel";
import { requestModel } from "./schema/requestSchema";
import { userI, userModel } from "./schema/userModel";

export class UserRepository {
    async createUser(userEntity:User){
        const user = new userModel(userEntity)
        return user.save()
    }

    async findUserByEmail(email:string){
        
        console.log(await userModel.findOne({email:email}));
        
        return await userModel.findOne({email:email})
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

     async findUsers(query:string,mainUser:string){
        return await userModel.find({username: new RegExp(query,'i'),_id:{$ne:mainUser}}).select('username email image')
     }

     async findExistingFriendRequest(receiverId:string,senderId:string){
        return await requestModel.findOne({receiver:receiverId,sender:senderId})
     }

     async sendFriendRequest(receiverId:string,senderId:string){
        
        const friendRequest = new requestModel({receiver:receiverId,sender:senderId})
        return await friendRequest.save()
     }

     async findPendingRequest(userId:string){
        return await requestModel.find({receiver:userId}).populate('sender')
     }

     async findFriendRequest(requestId:string){
        return await requestModel.findById(requestId)
     }

     async getFriendsByUserId(sender:string){
        return await friendsModel.findById(sender)
     }

     async removeFriendRequest(id:string){
        return await requestModel.findByIdAndDelete(id);
      };


    async upsertFriends(userId:object,friendId:object){
        await friendsModel.updateOne(
            {userId:userId},
            {$addToSet:{friends:friendId}},
            {upsert:true}
        )
    }



}
