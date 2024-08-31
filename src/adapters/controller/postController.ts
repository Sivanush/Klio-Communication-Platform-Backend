import { NextFunction, Request, Response } from "express";
import { PostUseCase } from "../../usecase/postUseCase";
import { PostRepository } from "../repository/postRepository";




export class PostController {
    constructor(private postUseCase: PostUseCase, private postRepository: PostRepository) {
        this.postRepository = new PostRepository()
        this.postUseCase = new PostUseCase(postRepository)
    }

    async createPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { content, type, mediaUrl } = req.body
            const userId = req.user?.userId

            let post 
            if (userId) {
                if (mediaUrl) {
                    post = await this.postUseCase.executeCreatePost(content, type, userId, mediaUrl)
                } else {
                    post = await this.postUseCase.executeCreatePost(content, type, userId)
                }
            } else {
                res.status(401).json({ message: "Unauthorized" })
                return
            }
            res.status(201).json(post)
        } catch (err) {
            next(err)
        }
    }


    async getUserPost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {userId} = req.params

            const posts = await this.postUseCase.executeGetUserPost(userId!)

            res.status(200).json(posts)
        } catch (err) {
            next(err)
        }
    }

    async getExplorePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId

            const posts = await this.postUseCase.executeGetExplorePost(userId!)

            res.status(200).json(posts)
        } catch (err) {
            next(err)
        }
    }


    async likeAndUnlikePost(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?.userId
            const {postId} = req.params

            await this.postUseCase.executeLikeAndUnlikePost(userId!,postId)

            res.status(200).json({message:'Success'})
        } catch (err) {
            next(err)
        }
    }

}






