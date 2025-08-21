import { Model } from "mongoose";

import IUserContract from "../IUser.repository";
import { EntityUser } from "../../entities/user";

export class UserRepository implements IUserContract{
    constructor(
        private readonly userModel: Model<EntityUser>
    ){}

    public findByEmail = async (email: string) =>{
        const user = await this.userModel.findOne({email}).lean()
        return user
    }
    public findById = async (userId: string) => {
        const user = await this.userModel.findOne({userId}).lean()
        return user
    }

    public create = async (userObject: EntityUser) => {
        const user = await this.userModel.create(userObject)
        return user.toObject()
    }
    public update = async (userId: string, dataToUpdate: Partial<Omit<EntityUser, "userId" | "email" | "isGoogleAuth" | "accountStatus" | "favItens" | "favMuseums">>) => {
        const user = await this.userModel.findOneAndUpdate(
            { userId },
            { $set: dataToUpdate },
            { new: true }
        ).lean()
        return user
    }
    public updateEmail = async (userId: string, email: string) => {
        const user = await this.userModel.findOneAndUpdate(
            { userId },
            { $set: {email} },
            { new: true }
        ).lean()
        return user
    }
    public updatePassword = async (userId: string, newHashedPassword: string) => {
        await this.userModel.updateOne(
            { userId },
            { $set: {password: newHashedPassword} }
        )
    }
    public updateAccountStatus = async (userId: string, status: EntityUser["accountStatus"]) => {
        const user = await this.userModel.findOneAndUpdate(
            { userId },
            {$set: {accountStatus: status }},
            { new: true }
        ).lean()
        return user
    }

    public delete = async (userId: string) => {
        await this.userModel.deleteOne({userId})
    }

    public addFavoriteItem = async (userId: string, itemId: string) => {
        await this.userModel.updateOne(
            { userId },
            { $addToSet: { favItens: itemId } }
        )
    }
    public removeFavoriteItem = async (userId: string, itemId: string) => {
        await this.userModel.updateOne(
            { userId },
            { $pull: { favItens: itemId } }
        )
    }

    public addFavoriteMuseum = async (userId: string, museumId: string) => {
        await this.userModel.updateOne(
            { userId },
            { $addToSet: { favMuseums: museumId } }
        )
    }
    public removeFavoriteMuseum = async (userId: string, museumId: string) => {
        await this.userModel.updateOne(
            { userId },
            { $pull: { favMuseums: museumId } }
        )
    }    
}