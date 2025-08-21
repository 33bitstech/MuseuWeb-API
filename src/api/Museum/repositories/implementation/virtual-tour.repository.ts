import { Model } from "mongoose";
import IVirtualTourRepositoryContract from "../IVirtualTour.repository";
import { EntityVirtualTour } from "../../entities/virtual-tour";

export class VirtualTourRepository implements IVirtualTourRepositoryContract{
    constructor(
        private readonly virtualTourModel = Model<EntityVirtualTour>
    ){}

}