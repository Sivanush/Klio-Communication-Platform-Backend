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
