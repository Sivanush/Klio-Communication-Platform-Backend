import { ClientSession } from "mongoose";
import { Server } from "../../entity/server";
import { categoryModel } from "./schema/categorySchema";
import { channelModel } from "./schema/channelSchema";
import { serverMemberModel } from "./schema/serverMemberSchema";
import { serverModel } from "./schema/serverSchema";
import { inviteModel } from "./schema/inviteCodeScema";


export class ServerRepository{
    
    async createServer(serverEntity: Server) {
        const server = new serverModel(serverEntity);
        return server.save();
    }
    async createServerWithoutImage(serverEntity: Server){
        const server = new serverModel({
            name: serverEntity.name,
            owner:serverEntity.owner
        })
        return server.save();
    }

    async addServerAdmin(serverId: unknown, ownerId: string) {
        const serverMember = new serverMemberModel({
            server: serverId,
            userId: ownerId,
            roles: ['owner', 'admin']
        });
        await serverMember.save();
    }

    async addServerUser(serverId: unknown, userId: string) {
        const serverMember = new serverMemberModel({
            server: serverId,
            userId: userId,
            roles:['member']
        });
        await serverMember.save();
    }



    async getAllServers(userId: string) {
        return await serverMemberModel.find({ userId }).populate('server');
    }
    
    async findMainChannel(serverId:string){
        return await channelModel.findOne({ server: serverId}).sort({createdAt:1})
    }

    async createCategoryInServer(name: string, serverId: string) {
        const category = new categoryModel({
            name,
            server: serverId
        });
        return await category.save();
    }

    async createChannelInCategory(name: string, type: string, serverId: string, categoryId: string) {
        const channel = new channelModel({
            name,
            type,
            server: serverId,
            category: categoryId
        });
        return await channel.save();
    }

    async getServerDetailById(serverId:string){
        return await serverModel.findById(serverId).lean()
        
    }

    async getCategoryDetailByServerId(serverId:string){
        return await categoryModel.find({server: serverId}).lean()
    }

    async getChannelDetailByServerId(serverId:string){
        return await channelModel.find({server: serverId}).lean()
    }

    async createNewInviteCode(serverId:string,inviteCode:string,expireDate:Date){
        const newInvite = new inviteModel({
            serverId: serverId,
            inviteCode: inviteCode,
            expiredAt: expireDate
        })
        await newInvite.save()
    }

    async getInviteCodeDetail(inviteCode:string){
        return await inviteModel.findOne({inviteCode: inviteCode}).lean()
    }

    async getServerDetailByInviteCode(inviteCode:string){
        return await inviteModel.findOne({inviteCode:inviteCode}).populate('serverId').lean()
    }

    async getUserCountByServerId(serverId:string){
        return await serverMemberModel.countDocuments({server: serverId}).lean()
    }

    async findUserExistInTheServer(userId:string,serverId:string){
        return await serverMemberModel.findOne({userId: userId ,server:serverId}).lean()
    }
}   