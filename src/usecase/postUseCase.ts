import { PostRepository } from "../adapters/repository/postRepository";

export class PostUseCase{

    constructor(private postRepository:PostRepository) {
        this.postRepository = new PostRepository()
    }

    async executeCreatePost(content:string,type:string,userId:string,mediaUrl?:string){
        if (!type) throw new Error("type is not provided try again");
        if (mediaUrl) {
            return await this.postRepository.createPost(content,type,userId,mediaUrl)
        } else {
            if (!content) throw new Error("Content is not provided try again")
            return await this.postRepository.createPost(content,type,userId)
        }
       
    }

    async executeGetUserPost(userId:string){
        if (!userId) throw new Error("Unauthorized user try again");

        return await this.postRepository.findPostByUserId(userId)
    }

    async executeGetExplorePost(userId:string){
        if (!userId) throw new Error("Unauthorized user try again");
    
        return await this.postRepository.getPostForExplorePage(userId)
    }


    async executeLikeAndUnlikePost(userId:string,postId:string){
        if (!userId) throw new Error("Unauthorized user try again");
        if (!postId) throw new Error("Post Id is not provided try again");

        return await this.postRepository.likeAndUnlikeComment(userId,postId)
    }


    async executeGetCommentOnPost(postId:string){
        if (!postId) throw new Error("Post Id is not provided try again");

        return await this.postRepository.getComments(postId)
    }


    async executeCommentOnPost(postId:string,comment:string,userId:string){
        if (!postId) throw new Error("Post Id is not provided try again");
        if (!comment) throw new Error("Comment is not provided try again");
        if (!userId) throw new Error("Unauthorized user try again");


        return await this.postRepository.commentOnPost(postId,comment,userId)

    }
}