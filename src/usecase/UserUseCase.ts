import { UserRepository } from "../adapters/repository/userRepository";
import bcrypt from 'bcrypt';
import { DecodedData, User } from "../entity/user";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateOtp } from "../utils/common";
import { MailerService } from "../adapters/services/mailerService";
dotenv.config();

const mailerService = new MailerService()

export class UserUseCase {
    constructor(private userRepository: UserRepository) { }

    async executeSignup(userEntity: User) {
        
        const existUser = await this.userRepository.findUserByEmail(userEntity.email)

        if (existUser) {
            throw new Error('User Already Exist')
        }

        const hashedPassword = await bcrypt.hash(userEntity.password, 10)
        userEntity.password = hashedPassword

        const createUser = await this.userRepository.createUser(userEntity)
        // return createUser

        const otp = generateOtp()
        console.log('OTP is Generated: '+otp);


        await mailerService.sendEmail(createUser.email,otp)

        const otpToken = jwt.sign({email:createUser.email,otp}, process.env.JWT_SECRET_C0DE as string ,{expiresIn:60})

        return { message:'OTP is sended successfully to your email ' ,otpToken }
    }


    async executeLogin(userEntity:User){

        const user = await this.userRepository.findUserByEmail(userEntity.email) 

        if (!user || !await bcrypt.compare(userEntity.password, user.password)) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_C0DE as string, { expiresIn: '2 days' })

        return token
    }

    async executeOtpVerification(otp:string,otpToken:string){

        const DecodedData = jwt.verify(otpToken,process.env.JWT_SECRET_C0DE as string) as DecodedData

        const userEmail = DecodedData.email 
        const userOtp = DecodedData.otp
        console.log(typeof userOtp, typeof otp);
        if (parseInt(userOtp) !==  parseInt(otp)) {
            throw new Error('Otp is Invalid')
        }else{
            this.userRepository.userVerifying(userEmail)
            return {message:'User Verified Successfully'}
        }
    }

}