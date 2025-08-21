import { Router } from "express"

import { MuseumModel } from "../models/museum.schema"
import { ItemModel } from "../models/item.schema"
import { VirtualExhibitionModel } from "../models/virtual-exhibition.schema"
import { VirtualTourModel } from "../models/virtual-tour.schema"
import { MuseumRepository } from "../repositories/implementation/museum.repository"

const museumRouter = Router()

//repositories
export const museumRepository = new MuseumRepository(
    MuseumModel
)

//services

//controllers

export {museumRouter}