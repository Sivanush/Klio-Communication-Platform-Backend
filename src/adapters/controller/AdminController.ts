import { NextFunction, Request, Response } from "express";
import { AdminUseCase } from "../../usecase/adminUseCase";
import { AdminRepository } from "../repository/adminRepository";
import { User } from "../../entity/user";

export class AdminController {

    constructor(private adminRepository: AdminRepository, private adminUsecase: AdminUseCase) {
        this.adminRepository = new AdminRepository()
        this.adminUsecase = new AdminUseCase(this.adminRepository)
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                throw new Error("Email and password are required");
            }

            const adminData = <User>{ email, password }

            const result = await this.adminUsecase.executeLogin(adminData)
            console.log('Result ', result);

            res.status(200).json({ result, message: 'Login Successfully ' })
        } catch (err) {
            next(err)
        }
    }


    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {

            const result = await this.adminUsecase.executeGetUsers()

            res.status(200).json({ result })
        } catch (err) {
            next(err)
        }
    }

    async toggleUserBlock(req: Request, res: Response, next: NextFunction) {
        try {

            const { userId } = req.params

            if (!userId) {
                res.status(400).json({ error: 'User Id Not Found, Try Again' })
                return
            }

            await this.adminUsecase.executeToggleUserBlock(userId)

            res.status(200).json({ message: 'Successfully User Status Changed' })

        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ error: err.message })
            } else {
                res.status(400).json({ error: 'Internal Server Error' })
            }
        }
    }
}