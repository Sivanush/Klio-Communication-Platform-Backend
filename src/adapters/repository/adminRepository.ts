import { User } from "../../entity/user";
import { userModel } from "./schema/userModel";


export class AdminRepository{
   
    

    async findAdminUser(email:string){
        return await userModel.findOne({email:email})
    }


    async getUsers(){
        return await userModel.find({isAdmin:false});
    }

    async findUserById(userId:string){
        
        return await userModel.findById(userId)
    }

    async updateUser(userData:User) {
       return await userModel.findByIdAndUpdate(userData._id, userData, { new: true });
    }
}