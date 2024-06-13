import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


declare global {
    namespace Express {
        interface Request {
            user?: any
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
            const decoded = jwt.verify(token,process.env.JWT_SECRET_C0DE as string)
            req.user = decoded;
            console.log(req.user+'==============');
            next();
        } catch (err) {
            res.status(400).send('Invalid Token');
        }
    } 
}