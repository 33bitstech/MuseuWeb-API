import { Model } from "mongoose";
import { EntityItem } from "../../entities/item";
import IItemRepositoryContract, { IItemSearchFilters } from "../IItem.repository";

export class ItemRepository implements IItemRepositoryContract{
    constructor(
        private readonly itemModel: Model<EntityItem>
    ){}

    public create = async (data: Omit<EntityItem, "createdAt" | "updatedAt">) => {
        const item = await this.itemModel.create(data)
        return item.toObject()
    };
    public delete = async (itemId: string) => {
        await this.itemModel.deleteOne(
            { itemId }
        )
    }
    public deleteAllByMuseum = async (museumId: string) => {
        await this.itemModel.deleteMany({
            museumId
        })
    }
    public findById = async (itemId: string) => {
        const item = await this.itemModel.findOne({itemId}).lean()
        return item
    }
    public findByInventoryNumber = async (museumId: string, inventoryNumber: string) => {
        const item = await this.itemModel.findOne({museumId, inventoryNumber}).lean()
        return item
    }
    public findRecentlyAddedByMuseum = async (museumId: string, limit: number) => {
        const items = await this.itemModel
            .find({ museumId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean()
        return items
    }
    public findAllByMuseum = async (museumId: string, page: number, limit: number) => {
        const skip = (page - 1) * limit
        const items = await this.itemModel
            .find({ museumId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await this.itemModel.countDocuments({ museumId })

        return {items, total}
    }
    public findAll = async (page: number, limit: number) => {
        const skip = (page - 1) * limit
        const items = await this.itemModel
            .find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await this.itemModel.countDocuments()

        return {items, total}
    }
    public search = async (filters: IItemSearchFilters, page: number, limit: number) => {
        const skip = (page - 1) * limit

        const {
            title, tags, museumId, 
            author, category, collection, 
            material, period
        } = filters

        const query: any = {}

        if(title) query.title = { $regex: title, $options: 'i' }
        if(author) query.author = { $regex: author, $options: 'i' }

        if(museumId) query.museumId = museumId
        if(category) query.category = category
        if(collection) query.collection = collection
        if(material) query.material = material
        if(period) query.period = period

        if(tags && tags.length > 0) query.tags = { $all: tags }


        const items = await this.itemModel
            .find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await this.itemModel.countDocuments(query)

        return {items, total}
    }
    public updateItemInfo = async (itemId: string, data: Partial<Pick<EntityItem, "title" | "descriptionShort" | "descriptionLong" | "category" | "collection" | "period" | "itemType" | "material" | "technique" | "origin" | "actualLocation" | "itemCondition" | "author" | "provenance" | "history" | "dimensions" | "copyright">>) => {
        await this.itemModel.updateOne(
            { itemId },
            { $set: data }
        )
    }
    public updateTotalsize = async (itemId: string, totalSize: number) =>{
        await this.itemModel.updateOne(
            { itemId },
            { $set: { totalSize } }
        )
    }
    public addTag = async (itemId: string, tag: string) => {
        await this.itemModel.updateOne(
            { itemId },
            { $set: {'tags.$': tag} }
        )
    }
    public removeTag = async (itemId: string, tag: string) => {
        await this.itemModel.updateOne(
            { itemId },
            { $pull: { tags: tag } }
        )
    }
    public addDocument = async (itemId: string, document: NonNullable<EntityItem["documents"]>[number]) =>{
        await this.itemModel.updateOne(
            { itemId },
            { $push: { documents: document } }
        )
    }
    public removeDocument = async (itemId: string, documentId: string) => {
        await this.itemModel.updateOne(
            { itemId },
            { $pull: { tags: { _id: documentId } } }
        )
    }
    public addImage = async (itemId: string, image: EntityItem["images"][number]) => {
        await this.itemModel.updateOne(
            { itemId },
            { $push: {images: image} }
        )
    }
    public removeImage = async (itemId: string, imageId: string) => {
        await this.itemModel.updateOne(
            { itemId },
            { $pull: { documents: { _id: imageId } } }
        )
    }
}