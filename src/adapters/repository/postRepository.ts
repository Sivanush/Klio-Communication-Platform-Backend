import mongoose from "mongoose";
import { postModel } from "./schema/postSchema";
import { LikeModel } from "./schema/likeSchema";
import { CommentModel } from "./schema/commentSchema";


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
        const posts = await postModel.find({ author: userId })
            .populate({
                path: 'author',
                select: 'username image'
            });

        // Iterate over posts and attach like/comment counts
        const postsWithCounts = await Promise.all(posts.map(async (post) => {
            const postId = post._id;

            // Get like and comment counts for each post
            const [likeCount, commentCount,isLiked] = await Promise.all([
                LikeModel.countDocuments({ postId: new mongoose.Types.ObjectId(postId) }),
                CommentModel.countDocuments({ postId: new mongoose.Types.ObjectId(postId) }),
                LikeModel.exists({ postId: new mongoose.Types.ObjectId(postId), user: new mongoose.Types.ObjectId(userId) })
            ]);

            return {
                ...post.toObject(),
                likeCount,
                commentCount,
                isLiked: !!isLiked 
            };
        }));

        return postsWithCounts;
    }


    async getPostForExplorePage(userId: string) {
        return await postModel.aggregate([
            { $match: { author: { $ne: new mongoose.Types.ObjectId(userId) } } },

            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorInfo'
                }
            },
            { $unwind: '$authorInfo' },

            {
                $addFields: {
                    likeCount: { $size: '$likes' },
                    commentCount: { $size: '$comments' }
                }
            },

            // Sort by engagement (you can adjust this based on your preferences)
            { $sort: { likeCount: -1, commentCount: -1, timestamp: -1 } },


            //   { $skip: skip },
            //   { $limit: limit },

            // Project only the fields we need
            {
                $project: {
                    _id: 1,
                    content: 1,
                    mediaUrl: 1,
                    mediaType: 1,
                    likeCount: 1,
                    commentCount: 1,
                    timestamp: 1,
                    author: {
                        _id: '$authorInfo._id',
                        username: '$authorInfo.username',
                        image: '$authorInfo.image'
                    }
                }
            }

        ])
    }


    async likeAndUnlikeComment(userId: string, postId: string) {
        const existingLike = await LikeModel.findOne({ postId: new mongoose.Types.ObjectId(postId), user: new mongoose.Types.ObjectId(userId) });

        if (existingLike) {
            return await LikeModel.deleteOne({ _id: existingLike._id });
        } else {
            const newLike = new LikeModel({
                postId: new mongoose.Types.ObjectId(postId),
                user: new mongoose.Types.ObjectId(userId)
            });

            return await newLike.save();
        }

    }

}