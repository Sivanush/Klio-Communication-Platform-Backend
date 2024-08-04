import { UploadApiResponse } from "cloudinary";
import { ServerRepository } from "../adapters/repository/serverRepository";
// import cloudinary from 'cloudinary';
import { Server } from "../entity/server";
import cloudinary from "../utils/cloudinary";
import { IServerMember } from "../interfaces/serverInterface";
import mongoose, { ClientSession, Types } from "mongoose";
import { serverModel } from "../adapters/repository/schema/serverSchema";
import { generateInviteToken } from "../utils/common";




export class ServerUseCase {
    constructor(private serverRepository: ServerRepository) {

    }


    async executeCreateServer(server: Server) {
        if (server.image) {
            if (Buffer.isBuffer(server.image)) {

                const result = await new Promise<UploadApiResponse>((res, rej) => {
                    const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            throw new Error(error.message);
                        }
                        else if (result) res(result);
                        else rej(new Error('Upload failed with no error'));
                    })
                    uploadStream.end(server.image);
                })
                server.image = result.secure_url
            } else {
                throw new Error("Try Again Error In Image");
            }
        }
        const session: ClientSession = await serverModel.startSession();
        session.startTransaction();


        try {
            let createdServer = null
            if (server.image) {
                createdServer = await this.serverRepository.createServer(server);
            }else{
                createdServer = await this.serverRepository.createServerWithoutImage(server);
            }
            await this.serverRepository.addServerAdmin(createdServer._id, server.owner);
            const category = await this.serverRepository.createCategoryInServer('General', createdServer._id.toString());
            await this.serverRepository.createChannelInCategory('General', 'text', createdServer._id.toString(), category._id as string);

            return createdServer;
        } catch (error) {
            throw error;
        }

    }



    async executeGetAllServers(userId: string) {
        let serverMember = await this.serverRepository.getAllServers(userId)


        let servers = serverMember.map(async (memberShip) => {
            const castedMemberShip = memberShip as unknown as IServerMember
            const channelId = await this.serverRepository.findMainChannel(castedMemberShip.server?._id as string)

            return {
                _id: castedMemberShip.server?._id,
                name: castedMemberShip.server?.name,
                image: castedMemberShip.server?.image,
                role: castedMemberShip.roles,
                channelId: channelId?._id
            };
        })

        const resolvedServers = await Promise.all(servers)

        return resolvedServers
    }

    async executeGetServerDetail(serverId: string) {
        if (!serverId) throw new Error("Server ID Not Found Try Again");

        let serverDetail = await this.serverRepository.getServerDetailById(serverId)

        if (!serverDetail) throw new Error("Something Went Wrong, Try Again");

        let categories = await this.serverRepository.getCategoryDetailByServerId(serverDetail._id.toString())

        let channels = await this.serverRepository.getChannelDetailByServerId(serverDetail._id.toString())

        const categoryWithChannels = categories.map((category) => ({
            ...category,
            channels: channels.filter(channels => channels.category._id.toString() == category._id.toString())
        }))

        categoryWithChannels.forEach((category) => {
            category.channels.sort((a, b) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
        });


        return {
            ...serverDetail,
            categories: categoryWithChannels
        }
    }


    async executeGenerateInviteCode(serverId: string) {
        if (!serverId) throw new Error("Server ID Not Found Try Again");
        const inviteCode = generateInviteToken()
        const expireDate = new Date(Date.now() + 60 * 60 * 1000)

        await this.serverRepository.createNewInviteCode(serverId, inviteCode, expireDate)

        return {
            inviteCode: inviteCode,
            expireDate: expireDate
        }
    }

    async executeJoinServer(inviteCode: string, userId: string) {
        if (!inviteCode) throw new Error("Invite Code Not Found Try Again");
        if (!userId) throw new Error("User ID Not Found Try Again");

        const inviteCodeDetail = await this.serverRepository.getInviteCodeDetail(inviteCode)

        if (!inviteCodeDetail) throw new Error("Invite Code Not Found Try Again");

        if (new Date() > inviteCodeDetail.expiredAt) {
            throw new Error("Invite link has expired");
        }

        const userExist = await this.serverRepository.findUserExistInTheServer(userId, inviteCodeDetail.serverId)

        if (userExist) throw new Error("User already exist in the server");
        else {
            await this.serverRepository.addServerUser(inviteCodeDetail.serverId, userId)

            const channelId = await this.serverRepository.findMainChannel(inviteCodeDetail.serverId)

            if (channelId) {
                return `${inviteCodeDetail.serverId}/${channelId._id}`;
            } else {
                throw new Error("Something went wrong, Please try again"); 
            }
        }


    }

    async executeServerDetailByInvite(inviteCode: string) {
        if (!inviteCode) throw new Error("Invite Code Not Found Try Again");

        const serverDetail = await this.serverRepository.getServerDetailByInviteCode(inviteCode)
        console.log(serverDetail);
        

        if (!serverDetail) throw new Error("Server Details Not Found Try Again");

        const serverMemberCount = await this.serverRepository.getUserCountByServerId(serverDetail.serverId)

        if (!serverMemberCount) throw new Error("Server Member Count Not Found Try Again");

        return {
            serverDetail,
            serverMemberCount
        }
    }


    async executeCreateCategory(name:string,serverId:string){
        if (!serverId) throw new Error("Server id not found");

        console.log(serverId,'------')
        console.log(Types.ObjectId.isValid(serverId));
        
        if (!Types.ObjectId.isValid(serverId)) {
            throw new Error("Invalid server ID format");
        }

        const server = await this.serverRepository.getServerDetailById(serverId)

        if (!server) throw new Error("Server Not Found Try Again");

        const category = await this.serverRepository.createCategoryInServer(name,server._id.toString());

        return category;
        
    }



    async executeGetCategoryUnderServer(serverId:string){
        if(!serverId) throw new Error("Server id not found");

        const categories = await this.serverRepository.getCategoryUserServerById(serverId)

        if (!categories) throw new Error("Categories Not Found");

        return categories
    }
    

    async executeCreateChannel(name:string,type:string,categoryId:string){        
        const category = await this.serverRepository.findServerByCategoryId(categoryId)
        if(!category) throw new Error("Server or category Not found");
        const channel = await this.serverRepository.createChannelInCategory(name,type,category.server.toString(),categoryId)

        return channel
    } 

    async executeGetChannelDetail(channelId:string){
        if(!channelId) throw new Error("Channel Id not found, Try again");
        
        const channel = await this.serverRepository.getChannelDetailById(channelId)

        return channel
    }
}