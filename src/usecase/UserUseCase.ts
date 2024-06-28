import { UserRepository } from "../adapters/repository/userRepository";
import bcrypt from 'bcrypt';
import { DecodedData, User } from "../entity/user";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { generateOtp, generateResetToken } from "../utils/common";
import { MailerService } from "../adapters/services/mailerService";
dotenv.config();

const mailerService = new MailerService()

export class UserUseCase {
    constructor(private userRepository: UserRepository) { }

    async executeSignup(userEntity: User) {
        
        const existUser = await this.userRepository.findUserByEmail(userEntity.email)

        if (existUser && existUser.isVerified === true) {
            throw new Error('User Already Exist')
        }

        const hashedPassword = await bcrypt.hash(userEntity.password, 10)
        userEntity.password = hashedPassword

        const createUser = await this.userRepository.createUser(userEntity)

        const otp = generateOtp()
        console.log('OTP is Generated: '+otp);


        await mailerService.sendEmail(createUser.email,otp)

        const otpToken = jwt.sign({email:createUser.email,otp}, process.env.JWT_SECRET_C0DE as string ,{expiresIn:60})

        return { message:'OTP is sended successfully to your email ' ,otpToken }
    }


    async executeLogin(userEntity:User){

        const user = await this.userRepository.findUserByEmail(userEntity.email) 

        if(user?.isGoogle === true){
            throw new Error('Account linked to Google. Please sign in with Google to continue.')
        }

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


    async executeGoogleAuth(userEntity:User){
        const user = await this.userRepository.findUserByEmail(userEntity.email)

        if(user){
            const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_C0DE as string, { expiresIn: '2 days' })
            return token
        }else{  
            
            const hashedPassword = await bcrypt.hash(userEntity.uid as string, 10)

            const userData:User = {
                email: userEntity.email,
                username: userEntity.displayName,
                image: userEntity.photoURL,
                isVerified: true,
                password: hashedPassword,
                isBlocked: false,
                isGoogle:true
            }

            const createUser = await this.userRepository.createUser(userData)

            const token = jwt.sign({ userId: createUser._id }, process.env.JWT_SECRET_C0DE as string, { expiresIn: '2 days' });
            return  token 
        }
    }


    async executeForgetPassword(email:string){
        const userData = await this.userRepository.findUserByEmail(email)

        if (!userData) {
            throw new Error("User Not Found, Try Again");
        }

        const resetToken = generateResetToken()
        userData.resetToken = resetToken
        userData.resetTokenExpire = Date.now() + 600000 

        const userToUpdate = userData as User;

        await this.userRepository.updateUser(userToUpdate);


        await mailerService.sendEmailForToken(email,resetToken)
    }



    async executeResetPassword(token:string,newPassword:string){
        const userData = await this.userRepository.findUserByToken(token)
        
        if (!userData) {
            throw new Error("Invalid or expired reset token");           
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)

        userData.password = hashedPassword
        userData.resetToken = undefined
        userData.resetTokenExpire= undefined

        const userToUpdate = userData as User
        await this.userRepository.updateUser(userToUpdate)
    }



    async executeSearchUsers(query:string){
        const users = await this.userRepository.findUsers(query)
        return users
    }

}