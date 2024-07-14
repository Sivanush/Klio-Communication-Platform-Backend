import { Request, Response } from "express";
import { ServerUseCase } from "../../usecase/serverUserCase";
import { ServerRepository } from "../repository/serverRepository";
import { Server } from "../../entity/server";

export class ServerController{
    constructor(private serverRepository:ServerRepository,private serverUseCase:ServerUseCase) {
        
    }


    async createServer(req:Request,res:Response){
        try {
            const { serverName } = req.body
            const owner = req.user?.userId
            let imageUrl = null

            if (!owner) {
                res.status(500).json({error:'Something Went Wrong, Please try Again'})
                return
            }   
            
            if (req.file) {
                imageUrl = req.file.buffer
            }

            const serverEntity = <Server>{image:imageUrl,name:serverName,owner:owner}
            await this.serverUseCase.executeCreateServer(serverEntity)

            res.status(201).json({message:'Server Created'})
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            }
        }
    }


    async getAllServers(req:Request,res:Response){
        try {
            const userId = req.user?.userId
            const servers = await this.serverUseCase.executeGetAllServers(userId as string)
            res.status(200).json(servers)
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            }
        }
    }


    async getServerDetail(req:Request,res:Response){
        try {
            const {serverId} = req.params

            const serverDetails = await this.serverUseCase.executeGetServerDetail(serverId)

            res.status(200).json(serverDetails)

        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            } 
        }
    }
}