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
userRouter.post('/resend-otp',userController.resendOtp.bind(userController))
userRouter.post('/googleAuth',userController.googleAuth.bind(userController))
userRouter.post('/forget-password',userController.forgetPassword.bind(userController))
userRouter.post('/reset-password',userController.resetPassword.bind(userController))
userRouter.get('/user-data',auth.authMiddleware,userController.getUserData.bind(userController))
userRouter.get('/user/:userId',auth.authMiddleware,userController.getUserDataForFriend.bind(userController))
userRouter.post('/update-profile',auth.authMiddleware,userController.updateProfile.bind(userController))




