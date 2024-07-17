import { ClientSession } from "mongoose";
import { Server } from "../../entity/server";
import { categoryModel } from "./schema/categorySchema";
import { channelModel } from "./schema/channelSchema";
import { serverMemberModel } from "./schema/serverMemberSchema";
import { serverModel } from "./schema/serverSchema";


export class ServerRepository{
    
    async createServer(serverEntity: Server) {
        const server = new serverModel(serverEntity);
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
}   