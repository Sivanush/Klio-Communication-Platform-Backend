import { DirectChatRepository } from "../adapters/repository/directChatRepository";



export class DirectChatUseCase{
    constructor(private directChatRepository:DirectChatRepository) {
        
    }


    async executeDirectMessage(senderId:string,receiverId:string,message:string){
        return await this.directChatRepository.saveMessage(senderId,receiverId,message)
    }

    async executeGetMessages(senderId:string,receiverId:string){
        
    }
}