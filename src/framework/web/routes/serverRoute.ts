import express from 'express';
import { UserAuth } from '../middleware/userAuth';
import { ServerUseCase } from '../../../usecase/serverUserCase';
import { ServerRepository } from '../../../adapters/repository/serverRepository';
import multer from 'multer';
import { ServerController } from '../../../adapters/controller/serverController';

export const serverRouter = express.Router()
const serverRepository = new ServerRepository()
const serverUseCase = new ServerUseCase(serverRepository)
const serverController = new ServerController(serverRepository,serverUseCase)

const auth = new UserAuth()
const storage = multer.memoryStorage()
const upload = multer({storage:storage})


serverRouter.post('/create-server',upload.single('image'),auth.authMiddleware,serverController.createServer.bind(serverController))
serverRouter.get('/servers',auth.authMiddleware,serverController.getAllServers.bind(serverController))
serverRouter.get('/server-detail/:serverId',auth.authMiddleware,serverController.getServerDetail.bind(serverController))
serverRouter.post('/generate-invite-code',auth.authMiddleware,serverController.generateInviteCode.bind(serverController))
serverRouter.post('/join-server',auth.authMiddleware,serverController.joinServer.bind(serverController))
serverRouter.get('/server-detail-by-invite/:inviteCode',serverController.serverDetailByInvite.bind(serverController))
serverRouter.post('/create-category',auth.authMiddleware,serverController.createCategory.bind(serverController))
serverRouter.get('/server-category/:serverId',auth.authMiddleware,serverController.getCategoryUnderServer.bind(serverController))
serverRouter.post('/create-channel',auth.authMiddleware,serverController.createChannel.bind(serverController))
serverRouter.get('/channel-detail/:channelId',auth.authMiddleware,serverController.getChannelDetail.bind(serverController))
serverRouter.get('/servers/:serverId',auth.authMiddleware,serverController.getAllUserForServer.bind(serverController))
serverRouter.get('/servers/admin/:serverId/:userId',auth.authMiddleware,serverController.findAdminForServer.bind(serverController))
serverRouter.get('/servers/kick/:serverId/:userId',auth.authMiddleware,serverController.kickUserInServer.bind(serverController))