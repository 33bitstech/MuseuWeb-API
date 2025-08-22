import { Router } from "express"
import { CuratorModel } from "../models/curator.model"
import { CuratorRepository } from "../repositories/implementation/curator.repository"


const curatorRouter = Router()

//repositories
export const curatorRepository = new CuratorRepository(
    CuratorModel
)

//services

//controllers

export {curatorRouter}