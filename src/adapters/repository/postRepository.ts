import { postModel } from "./schema/postSchema";


export class PostRepository {


    async createPost(content: string, type: string, userId: string, mediaUrl?: string) {
        if (mediaUrl) {
            return await postModel.create({
                content: content,
                mediaType: type,
                author: userId,
                mediaUrl: mediaUrl
            })
        } else {
            return await postModel.create({
                content: content,
                mediaType: type,
                author: userId,
            })
        }
    }

    async findPostByUserId(userId: string) {
        return await postModel.find({
            author: userId
        }).populate({
            path: 'author',
            select: 'username image' 
        });
    }
    
}