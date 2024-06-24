import { User } from "../../entity/user";
import { userI, userModel } from "./mongoDB/userModel";

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
}
