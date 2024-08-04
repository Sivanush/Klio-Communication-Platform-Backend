import { Request, Response } from "express";
import { ServerUseCase } from "../../usecase/serverUserCase";
import { ServerRepository } from "../repository/serverRepository";
import { Server } from "../../entity/server";
import { generateInviteToken } from "../../utils/common";

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

    async generateInviteCode(req:Request,res:Response){
        try {
            const {serverId} = req.body            
            const newInvite = await this.serverUseCase.executeGenerateInviteCode(serverId)
            res.status(201).json({message:'Success',inviteCode:newInvite.inviteCode,expireDate:newInvite.expireDate})
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            } 
        }
    }

    async joinServer(req:Request,res:Response){
        try {
            const {inviteCode,userId} = req.body
            const serverData = await this.serverUseCase.executeJoinServer(inviteCode,userId)

            res.status(201).json({message:'Success',serverData})
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            } 
        }
    }

    async serverDetailByInvite(req:Request,res:Response){
        try {
            
            const {inviteCode} = req.params

            const serverDetail = await this.serverUseCase.executeServerDetailByInvite(inviteCode)

            res.status(200).json({message:'Success',serverDetail:serverDetail.serverDetail,memberCount:serverDetail.serverMemberCount})

            

        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            } 
        }
    }

    async createCategory(req:Request,res:Response){
        try {
            const {name,serverId} = req.body
            
            
            const category = await this.serverUseCase.executeCreateCategory(name,serverId)

            res.status(201).json({message:"Success",category})
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            } 
        }
    }

    async getCategoryUnderServer(req:Request,res:Response){
        try {
            const {serverId} = req.params

            const categories = await this.serverUseCase.executeGetCategoryUnderServer(serverId)

            res.status(200).json({message:'Success',categories})
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            } 
        }
    }

    async createChannel(req:Request,res:Response){
        try {
            const {name,type,categoryId} = req.body
            const channel = await this.serverUseCase.executeCreateChannel(name,type,categoryId)
            res.status(201).json({message:'Success',channel})
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            } 
        }
    }

    async getChannelDetail(req:Request,res:Response){
        try {
            const {channelId} = req.params

            const channelDetail = await this.serverUseCase.executeGetChannelDetail(channelId)

            res.status(200).json({message:'Success',channelDetail})
        } catch (err) {
            if (err instanceof Error) {
                res.status(400).json({error:err.message})
            } else {
                res.status(500).json({error:'Internal Server Error'})
            } 
        }
    }
}