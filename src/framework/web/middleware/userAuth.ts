import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserRepository } from "../../../adapters/repository/userRepository";
dotenv.config();

const userRepository = new UserRepository()

interface JwtPayload {
    userId: string;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload
        }
    }
}


export class UserAuth{
    constructor() {}

     async authMiddleware(req:Request,res:Response,next:NextFunction){
        const token = req.headers['authorization']?.split(' ')[1];  

        if (!token) {
            return res.status(401).send('Access Denied: No Token Provided!');
        }

        try {
            const decoded = jwt.verify(token,process.env.JWT_SECRET_C0DE as string)  as JwtPayload;
            if(decoded){
                const userData = await userRepository.findUserById(decoded.userId)
                if (userData?.isBlocked === true) {
                    
                    return res.status(401).send('Access Denied: You Are Blocked By Admin!');
                }
            }
            if (decoded) {                     
                req.user = decoded;
                next();
            }else{
                return res.status(401).send('Access Denied: Invalid Token Or Expired Provided!');
            }
        } catch (err) {
            res.status(400).send('Invalid Token');
        }
    } 
}