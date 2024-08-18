import { NextFunction, Request, Response } from "express";
import { FriendsUseCase } from "../../usecase/friendsUseCase";
import { FriendsRepository } from "../repository/friendsRepository";


export class FriendsController {
    constructor(private friendsRepository: FriendsRepository, private friendsUseCase: FriendsUseCase) {

    }

    async searchUsers(req: Request, res: Response, next: NextFunction) {
        try {


            if (!req.user || !req.user.userId) {
                return res.status(401).json({ error: 'Unauthorized: No user information found' });
            }

            const mainUser = req.user.userId


            if (!req.query.query || !mainUser) {
                res.status(400).json({ error: 'Something Went Wrong, Try Again' })
            }
            const users = await this.friendsUseCase.executeSearchUsers(req.query.query as string, mainUser)

            res.status(200).json({ users: users })


        } catch (err) {
            next(err)
        }
    }





    async sendRequest(req: Request, res: Response, next: NextFunction) {
        try {

            const { receiverId } = req.body

            if (!req.user || !req.user.userId) {
                return res.status(401).json({ error: 'Unauthorized: No user information found' });
            }

            const senderId = req.user.userId
            // console.log(senderId);


            await this.friendsUseCase.executeSendRequest(receiverId, senderId)

            res.status(201).json({ message: 'Friend Request Sended Successfully' })
        } catch (err) {
            next(err)
        }
    }


    async listPendingRequest(req: Request, res: Response, next: NextFunction) {
        try {

            if (!req.user || !req.user.userId) {
                return res.status(401).json({ error: 'Unauthorized: No user information found' });
            }


            const userId = req.user.userId

            const requests = await this.friendsUseCase.executeListPendingRequest(userId)

            res.status(200).json({ message: 'Pending request successfully received', requests })
        } catch (err) {
            next(err)
        }
    }

    async acceptFriendRequest(req: Request, res: Response, next: NextFunction) {
        try {

            const { requestId } = req.body

            if (!requestId) {
                return res.status(400).json({ message: 'Something Went Wrong, Try Again' });
            }

            await this.friendsUseCase.executeAcceptFriendRequest(requestId)


            res.status(200).json({ message: 'Friends Request Accepted ' })


        } catch (err) {
            next(err)
        }
    }


    async rejectFriendRequest(req: Request, res: Response,next: NextFunction) {
        try {
            const { requestId } = req.body


            if (!requestId) {
                return res.status(400).json({ message: 'Invalid friend request' });
            }


            await this.friendsUseCase.executeRejectFriendRequest(requestId)

            res.status(200).json({ message: 'Friend Request Rejected' });

        } catch (err) {
            next(err)
        }

    }

    async getAllFriends(req: Request, res: Response,next: NextFunction) {
        try {

            const userId = req.user?.userId

            if (userId === undefined) {
                res.status(400).json({ error: 'Something Went Wrong, Try Again' })
                return
            }

            const friends = await this.friendsUseCase.executeGetAllFriends(userId)

            res.status(200).json(friends ? friends : [])

        } catch (err) {
            next(err)
        }

    }

}