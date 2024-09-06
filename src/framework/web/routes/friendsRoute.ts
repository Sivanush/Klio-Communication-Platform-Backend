import express from 'express';
import { UserAuth } from '../middleware/userAuth';
import { FriendsRepository } from '../../../adapters/repository/friendsRepository';
import { FriendsUseCase } from '../../../usecase/friendsUseCase';
import { FriendsController } from '../../../adapters/controller/friendsController';

export const friendsRoute = express.Router()
const friendsRepository = new FriendsRepository()
const friendsUsecase = new FriendsUseCase(friendsRepository)
const friendsController = new FriendsController(friendsRepository,friendsUsecase)

const auth = new UserAuth()




friendsRoute.get('/search-users',auth.authMiddleware,friendsController.searchUsers.bind(friendsController))  
friendsRoute.post('/send-request',auth.authMiddleware,friendsController.sendRequest.bind(friendsController))  
friendsRoute.get('/pending-request',auth.authMiddleware,friendsController.listPendingRequest.bind(friendsController))  
friendsRoute.post('/accept-request',auth.authMiddleware,friendsController.acceptFriendRequest.bind(friendsController))  
friendsRoute.post('/reject-request',auth.authMiddleware,friendsController.rejectFriendRequest.bind(friendsController))  
friendsRoute.get('/all-friends',auth.authMiddleware,friendsController.getAllFriends.bind(friendsController))  
friendsRoute.get('/get-random-users',auth.authMiddleware,friendsController.getRandomUsers.bind(friendsController))