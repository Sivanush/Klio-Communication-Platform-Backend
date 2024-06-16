import express from 'express';
import { UserController } from '../../../adapters/controller/UserController';
import { UserRepository } from '../../../adapters/repository/userRepository';
import { UserUseCase } from '../../../usecase/UserUseCase';
import { UserAuth } from '../middleware/userAuth';

export const userRouter = express.Router()
const userRepository = new UserRepository()
const signUpUseCase = new UserUseCase(userRepository)
const userController = new UserController(userRepository,signUpUseCase)
const auth = new UserAuth()


userRouter.post('/signup',userController.signUp.bind(userController))
userRouter.post('/login',userController.login.bind(userController))
userRouter.post('/otp',userController.otpVerification.bind(userController))
userRouter.post('/googleAuth',userController.googleAuth.bind(userController))
