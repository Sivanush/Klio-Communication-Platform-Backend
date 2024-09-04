import express from 'express';
import { PostRepository } from '../../../adapters/repository/postRepository';
import { PostUseCase } from '../../../usecase/postUseCase';
import { PostController } from '../../../adapters/controller/postController';
import { UserAuth } from '../middleware/userAuth';




export const postRouter = express.Router()
const postRepository = new PostRepository()
const postUseCase = new PostUseCase(postRepository)
const postController = new PostController(postUseCase,postRepository)
const auth = new UserAuth()

postRouter.post('/create-post',auth.authMiddleware,postController.createPost.bind(postController))
postRouter.get('/user-post/:userId',auth.authMiddleware,postController.getUserPost.bind(postController))
postRouter.get('/explore-post',auth.authMiddleware,postController.getExplorePost.bind(postController))
postRouter.get('/like-post/:postId',auth.authMiddleware,postController.likeAndUnlikePost.bind(postController))
postRouter.get('/comments/:postId',auth.authMiddleware,postController.getCommentOnPost.bind(postController))
postRouter.post('/comment-post/:postId',auth.authMiddleware,postController.commentOnPost.bind(postController))