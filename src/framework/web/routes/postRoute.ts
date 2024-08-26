

import express from 'express';
import { PostRepository } from '../../../adapters/repository/postRepository';
import { PostUseCase } from '../../../usecase/postUseCase';
import { PostController } from '../../../adapters/controller/postController';
import { UserAuth } from '../middleware/userAuth';




export const postRouter = express.Router()
const serverRepository = new PostRepository()
const serverUseCase = new PostUseCase(serverRepository)
const serverController = new PostController(serverUseCase,serverRepository)
const auth = new UserAuth()

postRouter.post('/create-post',auth.authMiddleware,serverController.createPost.bind(serverController))
postRouter.get('/user-post',auth.authMiddleware,serverController.getUserPost.bind(serverController))