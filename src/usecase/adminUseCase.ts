import { AdminRepository } from "../adapters/repository/adminRepository";
import { User } from "../entity/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export class AdminUseCase {

    constructor(private adminRepository: AdminRepository) {
        this.adminRepository = new AdminRepository()
    }



    async executeLogin(adminData: User) {
        const userData = await this.adminRepository.findAdminUser(adminData.email)

        if (!userData || !await bcrypt.compare(adminData.password,userData.password)) {
            throw new Error("Invalid Credentials");
        }

        if (userData.isAdmin === false) {
            throw new Error("Access Denied");
        }

        
        const token = jwt.sign({adminToken:userData._id},process.env.JWT_SECRET_C0DE as string,{expiresIn:'2 days'})

        return token
    }

} 