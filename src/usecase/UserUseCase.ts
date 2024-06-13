import { UserRepository } from "../adapters/repository/userRepository";
import bcrypt from 'bcrypt';
import { User } from "../entity/user";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


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
        return createUser
    }


    async executeLogin(userEntity:User){

        const user = await this.userRepository.findUserByEmail(userEntity.email)

        if (!user || !await bcrypt.compare(userEntity.password, user.password)) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET_C0DE as string, { expiresIn: '2 days' })

        return token
    }

}