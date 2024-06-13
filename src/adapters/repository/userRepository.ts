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
}
