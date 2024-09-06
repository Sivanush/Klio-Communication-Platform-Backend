import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../repository/userRepository";
import { User } from "../../entity/user";
import { UserUseCase } from "../../usecase/UserUseCase";

export class UserController {
    constructor(private userRepository: UserRepository, private userUseCase: UserUseCase) {
        this.userRepository = new UserRepository()
        this.userUseCase = new UserUseCase(this.userRepository)
    }

    async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let { username, email, password } = req.body


            if (!username || !email || !password) {
                res.status(400).json({ error: "Username, email, and password are required." });
                return;
            }
            const userEntity = <User>{ username, email, password }
            const result = await this.userUseCase.executeSignup(userEntity)
            res.status(201).json(result)

        } catch (err) {
            next(err)
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
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
            next(err)
        }
    }

    async resendOtp(req: Request, res: Response, next: NextFunction) {
        try {

            const { email } = req.body

            if (!email) {
                res.status(400).json({ error: "Email is are required, Please Try Again" });
                return;
            }

            const result = await this.userUseCase.executeResendOtp(email)

            res.status(201).json(result)

        } catch (err) {
            next(err)
        }
    }



    async otpVerification(req: Request, res: Response, next: NextFunction) {
        try {

            const { otp, otpToken } = req.body

            if (!otpToken) {
                res.status(400).json({ message: 'OTP token is missing. Please try signing up again.' })
                return;
            } else if (!otp) {
                res.status(400).json({ message: 'OTP is missing. Please try again.' })
                return;
            }

            const result = await this.userUseCase.executeOtpVerification(otp, otpToken)
            res.status(200).json({ message: 'OTP Verification Successfully', result })

        } catch (err) {
            next(err)
        }
    }

    async googleAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const { uid, email, displayName, photoURL } = req.body

            if (!displayName || !email || !uid || !photoURL) {
                throw new Error("Internal Server Error. Try Again");
            }

            const userEntity = <User>{ email, uid, displayName, photoURL }
            const result = await this.userUseCase.executeGoogleAuth(userEntity)


            res.status(201).json({ message: "Success", token: result })
        } catch (err) {
            next(err)
        }
    }


    async forgetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body


            if (!email) {
                res.status(400).json({ error: 'Something Went Wrong, Try Again' })
                return
            }
            await this.userUseCase.executeForgetPassword(email)

            res.status(200).json({ message: 'Password reset link sent to your email successfully' })
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ error: err.message })
            } else {
                next(err)
            }
        }
    }




    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {

            const { token, newPassword } = req.body

            if (!token || !newPassword) {
                res.status(400).json({ error: 'Something Went Wrong, Try Again' })
            }

            await this.userUseCase.executeResetPassword(token, newPassword)

            res.status(200).json({ message: 'Password reset successfully' });

        } catch (err) {
            next(err)
        }
    }


    async getUserData(req: Request, res: Response, next: NextFunction) {
        try {

            const userId = req.user?.userId
            console.log(userId);

            const userData = await this.userUseCase.executeGetUserData(userId as string)

            res.json(userData)

        } catch (err) {
            next(err)
        }
    }


    async getUserDataForFriend(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.params

            const userData = await this.userUseCase.executeGetUserDataForFriend(userId)


            res.json(userData)
        } catch (err) {
            next(err)
        }
    }



    async updateProfile(req: Request, res: Response, next: NextFunction){
        try {
            
            const {_id,username,bio,status,image,banner} = req.body
            
            const userData:User =  {_id,username,bio,status,image,banner}

            await this.userUseCase.executeUpdateProfile(userData)

            res.status(200).json({message:'Success'})
        } catch (err) {
            next(err)
        }
    }



    


}