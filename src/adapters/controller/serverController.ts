import { NextFunction, Request, Response } from "express";
import { ServerUseCase } from "../../usecase/serverUserCase";
import { ServerRepository } from "../repository/serverRepository";
import { Server } from "../../entity/server";
import { generateInviteToken } from "../../utils/common";

export class ServerController{
    constructor(private serverRepository:ServerRepository,private serverUseCase:ServerUseCase) {
        
    }


    async createServer(req:Request,res:Response,next: NextFunction){
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
           next(err)
        }
    }


    async getAllServers(req:Request,res:Response,next: NextFunction){
        try {
            const userId = req.user?.userId
            const servers = await this.serverUseCase.executeGetAllServers(userId as string)
            res.status(200).json(servers)
        } catch (err) {
           next(err)
        }
    }


    async getServerDetail(req:Request,res:Response,next: NextFunction){
        try {
            const {serverId} = req.params

            const serverDetails = await this.serverUseCase.executeGetServerDetail(serverId)

            res.status(200).json(serverDetails)

        } catch (err) {
           next(err) 
        }
    }

    async generateInviteCode(req:Request,res:Response,next: NextFunction){
        try {
            const {serverId} = req.body            
            const newInvite = await this.serverUseCase.executeGenerateInviteCode(serverId)
            res.status(201).json({message:'Success',inviteCode:newInvite.inviteCode,expireDate:newInvite.expireDate})
        } catch (err) {
           next(err) 
        }
    }

    async joinServer(req:Request,res:Response,next: NextFunction){
        try {
            const {inviteCode,userId} = req.body
            const serverData = await this.serverUseCase.executeJoinServer(inviteCode,userId)

            res.status(201).json({message:'Success',serverData})
        } catch (err) {
           next(err) 
        }
    }

    async serverDetailByInvite(req:Request,res:Response,next: NextFunction){
        try {
            
            const {inviteCode} = req.params

            const serverDetail = await this.serverUseCase.executeServerDetailByInvite(inviteCode)

            res.status(200).json({message:'Success',serverDetail:serverDetail.serverDetail,memberCount:serverDetail.serverMemberCount})

            

        } catch (err) {
           next(err) 
        }
    }

    async createCategory(req:Request,res:Response,next: NextFunction){
        try {
            const {name,serverId} = req.body
            
            
            const category = await this.serverUseCase.executeCreateCategory(name,serverId)

            res.status(201).json({message:"Success",category})
        } catch (err) {
           next(err) 
        }
    }

    async getCategoryUnderServer(req:Request,res:Response,next: NextFunction){
        try {
            const {serverId} = req.params

            const categories = await this.serverUseCase.executeGetCategoryUnderServer(serverId)

            res.status(200).json({message:'Success',categories})
        } catch (err) {
           next(err) 
        }
    }

    async createChannel(req:Request,res:Response,next: NextFunction){
        try {
            const {name,type,categoryId} = req.body
            const channel = await this.serverUseCase.executeCreateChannel(name,type,categoryId)
            res.status(201).json({message:'Success',channel})
        } catch (err) {
           next(err) 
        }
    }

    async getChannelDetail(req:Request,res:Response,next: NextFunction){
        try {
            const {channelId} = req.params

            const channelDetail = await this.serverUseCase.executeGetChannelDetail(channelId)

            res.status(200).json({message:'Success',channelDetail})
        } catch (err) {
           next(err) 
        }
    }

    async getAllUserForServer(req:Request,res:Response,next: NextFunction){
        try {

            const {serverId} = req.params

            const userDetails = await this.serverUseCase.executeGetAllUserForServer(serverId)

            res.status(200).json(userDetails)

        } catch (err) {
            next(err) 
        }
    }

    async findAdminForServer(req:Request,res:Response,next: NextFunction){
        try {
            
            const {userId,serverId} = req.params

            const isAdmin = await this.serverUseCase.executeFindAdminForServer(userId,serverId)

            res.status(200).json(isAdmin)

        } catch (err) {
            next(err) 
        }
    }

    async kickUserInServer(req:Request,res:Response,next: NextFunction){
        try {
            const {userId,serverId} = req.params

            await this.serverUseCase.executeKickUserInServer(userId,serverId)

            res.status(200).json({message:'Success'})

        } catch (err) {
            next(err) 
        }
    }
}