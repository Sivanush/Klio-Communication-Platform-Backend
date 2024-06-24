import express from "express";
import { AdminRepository } from "../../../adapters/repository/adminRepository";
import { AdminUseCase } from "../../../usecase/adminUseCase";
import { AdminController } from "../../../adapters/controller/AdminController";


export const adminRoute = express.Router()
const adminRepository = new AdminRepository()
const adminUseCase = new AdminUseCase(adminRepository)
const adminController = new AdminController(adminRepository,adminUseCase)


adminRoute.post('/login',adminController.login.bind(adminController))
adminRoute.get('/getUsers',adminController.getUsers.bind(adminController))
adminRoute.post('/block/:userId',adminController.toggleUserBlock.bind(adminController))





