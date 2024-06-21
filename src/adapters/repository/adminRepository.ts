import { userModel } from "./mongoDB/userModel";


export class AdminRepository{
    

    async findAdminUser(email:string){
        
        console.log(await userModel.findOne({email:email}),"✅✅✅");
        
        return await userModel.findOne({email:email})
    }
}