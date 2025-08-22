import { Model } from "mongoose";
import ICuratorRepository from "../ICurator.repository";
import { EntityCurator } from "../../entities/curator";

export class CuratorRepository implements ICuratorRepository{
    constructor(
        private readonly curatorModel: Model<EntityCurator>
    ){}

    public create = async (data: EntityCurator) => {
        const curator = await this.curatorModel.create(data)
        return curator.toObject()
    }
    public findAll = async () => {
        const curators = await this.curatorModel.find().lean()
        return curators
    }
    public findById = async (curatorId: string) => {
        const curator = await this.curatorModel.findOne({curatorId}).lean()
        return curator
    }
    public findByName = async (name: string, museumId: string) => {
        const curator = await this.curatorModel.findOne({name, museumId}).lean()
        return curator
    }
    public findAllByMuseumId = async (museumId: string) => {
        const curators = await this.curatorModel.find({museumId}).lean()
        return curators
    }
    public update = async (curatorId: string, dataToUpdate: Partial<Omit<EntityCurator, "curatorId">>) => {
        const curator = await this.curatorModel.findOneAndUpdate(
            { curatorId }, 
            { $set: dataToUpdate },
            { new: true }
        ).lean()
        return curator
    }
    public updatePassword = async (curatorId: string, newHashedPassword: string) => {
        await this.curatorModel.updateOne(
            { curatorId },
            { $set: {password: newHashedPassword} }
        )
    }
    public delete = async (curatorId: string) => {
        await this.curatorModel.deleteOne({curatorId})
    }
}