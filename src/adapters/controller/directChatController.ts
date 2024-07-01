import { Request, Response } from "express";
import { DirectChatUseCase } from "../../usecase/directChatUseCase";
import { DirectChatRepository } from "../repository/directChatRepository";




export class DirectChatController{
    constructor(private directChatUseCase:DirectChatUseCase,private directChatRepository:DirectChatRepository) {
        
    }



    async joinDirectChat(req:Request,res:Response){
        try {
            const { userId, friendId } = req.body;
            res.send(`User ${userId} joined chat with ${friendId}`);
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({ message: err.message })
            } else {
                res.status(400).json({ message: 'Internal Server Error' })
            }
        }
    }
}