import { UploadApiResponse } from "cloudinary";
import { ServerRepository } from "../adapters/repository/serverRepository";
// import cloudinary from 'cloudinary';
import { Server } from "../entity/server";
import cloudinary from "../utils/cloudinary";
import { IServerMember } from "../interfaces/serverInterface";
import { ClientSession } from "mongoose";
import { serverModel } from "../adapters/repository/schema/serverSchema";




export class ServerUseCase {
    constructor(private serverRepository: ServerRepository) {

    }


    async executeCreateServer(server: Server) {
        console.log(server.image);
        
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
            let createdServer = await this.serverRepository.createServer(server);
            await this.serverRepository.addServerAdmin(createdServer._id, server.owner);
            const category = await this.serverRepository.createCategoryInServer('General', createdServer._id.toString());
            await this.serverRepository.createChannelInCategory('General', 'text', createdServer._id.toString(), category._id as string);

            return createdServer;
        } catch (error) {
            throw error;
        }

    }



    async executeGetAllServers(userId:string){
        let serverMember = await this.serverRepository.getAllServers(userId)
        
        let servers = serverMember.map((memberShip) =>{
            const castedMemberShip = memberShip as unknown as IServerMember
            return {
                _id: castedMemberShip.server?._id,
                name: castedMemberShip.server?.name,
                image: castedMemberShip.server?.image,
                role: castedMemberShip.roles
            };

        })

        return servers
    }

    async executeGetServerDetail(serverId:string){
        let serverDetail = await this.serverRepository.getServerDetailById(serverId)

        if (!serverDetail) throw new Error("Something Went Wrong, Try Again");

        let categories = await this.serverRepository.getCategoryDetailByServerId(serverDetail._id.toString())

        let channels = await this.serverRepository.getChannelDetailByServerId(serverDetail._id.toString())

        const categoryWithChannels = categories.map((category)=>({
            ...category,
            channels:channels.filter(channels=> channels.category._id.toString()==category._id.toString())
        }))

        categoryWithChannels.forEach((category) => {
            category.channels.sort((a, b) => {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            });
        });
     
        
        return {
            ...serverDetail,
            categories:categoryWithChannels
        }
    }
}