import { Request, Response } from "express";
import { AdminUseCase } from "../../usecase/adminUseCase";
import { AdminRepository } from "../repository/adminRepository";
import { User } from "../../entity/user";

export class AdminController{

    constructor(private adminRepository:AdminRepository,private adminUsecase:AdminUseCase) {
        this.adminRepository = new AdminRepository()
        this.adminUsecase = new AdminUseCase(this.adminRepository)
     }

    async login(req:Request,res:Response){
        try {
            const { email, password } = req.body

            if (!email||!password) {
                throw new Error("Email and password are required");            }

            const adminData = <User>{email,password}

            const result = await this.adminUsecase.executeLogin(adminData)
            console.log('Result ',result); 

            res.status(200).json({result ,message:'Login Successfully '})
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(400).json({error:'Internal Server Error'})
            }
        }
    }
}