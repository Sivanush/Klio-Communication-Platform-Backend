import express from 'express';
import { DirectChatRepository } from '../../../adapters/repository/directChatRepository';
import { DirectChatUseCase } from '../../../usecase/directChatUseCase';
import { DirectChatController } from '../../../adapters/controller/directChatController';
import { UserAuth } from '../middleware/userAuth';

export const directChat = express.Router()


const directChatRepository = new DirectChatRepository()
const directChatUseCase = new DirectChatUseCase(directChatRepository)
const directChatController = new DirectChatController(directChatUseCase,directChatRepository)

const auth = new UserAuth()


directChat.post('/join-direct-chat',auth.authMiddleware,directChatController.joinDirectChat.bind(directChatController))
directChat.post('/send-message',auth.authMiddleware,directChatController.sendMessage.bind(directChatController))

