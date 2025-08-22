import { Router } from "express"
import { UserModel } from "../models/user.schema"
import { UserRepository } from "../repositories/implementation/user.repository"


const userRouter = Router()

//repositories
export const userRepository = new UserRepository(
    UserModel
)

//services

//controllers

export {userRouter}