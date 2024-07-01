import { DirectChatRepository } from "../adapters/repository/directChatRepository";


export class DirectChatUseCase{
    constructor(private directChatRepository:DirectChatRepository) {
        
    }
}