import { Request, Response } from "express";
import { UserRepository } from "../repository/userRepository";
import { User } from "../../entity/user";
import { UserUseCase } from "../../usecase/UserUseCase";

export class UserController {
    constructor(private userRepository: UserRepository, private userUseCase: UserUseCase) {
        this.userRepository = new UserRepository()
        this.userUseCase = new UserUseCase(this.userRepository)
    }

    async signUp(req: Request, res: Response): Promise<void> {
        try {
            let { username, email, password } = req.body

            console.log(username, email, password);

            if (!username || !email || !password) {
                res.status(400).json({ error: "Username, email, and password are required." });
                return;
            }
            const userEntity = <User>{ username, email, password }
            const result = await this.userUseCase.executeSignup(userEntity)
            res.status(201).json(result)

        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ error: err.message })
            } else {
                res.status(400).json({ message: "Internal Server Error" });
            }
        }
    }

    async login(req: Request, res: Response) {
        const { email, password } = req.body

        try {
            if (!email || !password) {
                res.status(400).json({ error: "email, and password are required." });
                return;
            }
            const userEntity = <User>{ email, password }
            const token = await this.userUseCase.executeLogin(userEntity)
            console.log(token + '---------');

            res.status(200).json({ token });
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ message: err.message });
            } else {
                res.status(400).json({ message: "Internal Server Error" });
            }

        }
    }



    async otpVerification(req: Request, res: Response) {
        try {

            const { otp, otpToken } = req.body
            
            if (!otpToken) {
                res.status(400).json({ message: 'OTP token is missing. Please try signing up again.' })
                return;
            } else if (!otp) {
                res.status(400).json({ message: 'OTP is missing. Please try again.' })
                return;
            }

            const result = await this.userUseCase.executeOtpVerification(otp,otpToken)
            res.status(200).json({message:'OTP Verification Successfully',result})

        } catch (err) {

            if (err instanceof Error) {

                res.status(400).json({ message: err.message })
            } else {

                res.status(400).json({ message: 'Internal Server Error' })
            }
        }
    }

    async googleAuth(){
          console.log('google Auth working');
            
    }
}