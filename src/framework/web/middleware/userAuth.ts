import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

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
            req.user = decoded;
            next();
        } catch (err) {
            res.status(400).send('Invalid Token');
        }
    } 
}