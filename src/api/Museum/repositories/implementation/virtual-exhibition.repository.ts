import { Model } from "mongoose";
import IVirtualExhibitionRepositoryContract from "../IVirtualExhibition.repository";
import { EntityVirtualExhibition } from "../../entities/virtual-exhibition";

export class VirtualTourRepository implements IVirtualExhibitionRepositoryContract{
    constructor(
        private readonly virtualTourModel = Model<EntityVirtualExhibition>
    ){}
    
}