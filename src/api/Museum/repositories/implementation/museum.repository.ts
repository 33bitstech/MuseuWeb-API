import { Model, Query, UpdateQuery } from "mongoose";
import { EntityMuseum, IExternalLink, IGalleryItem, IOperatingHours, IRating, ITicketPrice, TAccessibilityFeature, TSubscription } from "../../entities/museum";

import IMuseumRepositoryContract, { IMuseumSearchFilters } from "../IMuseum.repository";
import { MuseumDatasArray, MuseumProfileData } from "../../DTOs/DTOMuseum";

export class MuseumRepository implements IMuseumRepositoryContract{
    constructor(
        private readonly museumModel: Model<EntityMuseum>
    ){}

    public findByEmail = async (email: string) =>{
        const museum = await this.museumModel.findOne({email}).lean()
        return museum
    }
    public findByIdentifier = async (identifier: string) =>{
        const museum = await this.museumModel.findOne(
            { $or: [
                { email: identifier}, 
                { cnpj: identifier }
            ] }
        ).lean()

        return museum
    }
    public findByCustomerId = async (museumCustomerId: string) => {
        const museum = await this.museumModel.findOne({stripeInfos: { museumCustomerId }}).lean()
        return museum
    }
    public findByInvoiceId = async (invoiceId: string) => {
        const museum = await this.museumModel.findOne({stripeInfos: { invoiceId }}).lean()
        return museum
    }
    public findById = async (museumId: string) => {
        const museum = await this.museumModel.findOne({museumId}).lean()
        return museum
    }

    public findByCnpj = async (cnpj: string) => {
        const museum = await this.museumModel.findOne({cnpj})
        return museum
    }

    public findAll = async (limit?: number) => {
        let query = this.museumModel.find()

        if (limit && limit > 0) query.limit(limit)
        
        const museums = await query.lean()

        return museums
    }

    public search = async (filters: IMuseumSearchFilters, page: number, limit: number) => {
        const {
            name, state, city, type,
            accessibilityFeatures, minRating
        } = filters

        const query: any = {}
        
        if(name) query.name = { $regex: name, $options: 'i' }
        if(state) query['address.state'] = state
        if(city) query['address.city.name'] = city
        if(type) query.type = type

        if(accessibilityFeatures && accessibilityFeatures.length > 0) {
            //o museu precisa ter todas as features q estão no filtro
            query.accessibilityFeatures = { $all: accessibilityFeatures }
        }
        if(minRating && minRating >= 1 && minRating <= 5){
            // greater than or equal (maior que ou igual | >=)
            query['rating.totalRating'] = { $gte: minRating }
        }
        const skip = (page - 1) * limit

        const museums = await this.museumModel
            .find(query)
            .sort({'rating.totalRating': -1})
            .skip(skip)
            .limit(limit)
            .lean()

        const total = await this.museumModel.countDocuments(query)

        return {museums, total}

    }

    public create = async (data: EntityMuseum) => {
        const museum = await this.museumModel.create(data)
        return museum.toObject()
    }
    public delete = async (museumId: string) => {
        await this.museumModel.deleteOne({museumId})
    }

    public updateProfileInfo = async (museumId: string, data: MuseumProfileData) => {
        await this.museumModel.updateOne(
            { museumId },
            { $set: data },
        )
    }
    public updateRating = async (museumId: string, newRatingData: IRating) => {
        await this.museumModel.updateOne(
            { museumId },
            { $set: newRatingData }
        )
    }
    public updatePassword = async (museumId: string, newHashedPassword: string) => {
        await this.museumModel.updateOne(
            {museumId}, 
            { $set: {password: newHashedPassword} }
        )
    }
    public updateEmail = async (museumId: string, newEmail: string) => {
        await this.museumModel.updateOne(
            {museumId}, 
            { $set: {email: newEmail} }
        )
    }
    public addAffiliate = async (museumId: string, affiliateId: string) => {
        await this.museumModel.updateOne(
            {museumId},
            { $addToSet: {affiliated: affiliateId} }
        )
    }
    public removeAffiliate = async (museumId: string, affiliateId: string) => {
        await this.museumModel.updateOne(
            {museumId},
            { $pull: {affiliated: affiliateId} }
        )
    }
    public addGalleryItem = async (museumId: string, item: IGalleryItem) => {
        await this.museumModel.updateOne(
            { museumId },
            { $addToSet:  {gallery: item}}
        )
    }
    public removeGalleryItem = async (museumId: string, galleryItemId: string) => {
        await this.museumModel.updateOne(
            { museumId },
            { $pull:  {gallery: {_id: galleryItemId}}}
        )
    }
    public upsertOperatingHours = async (museumId: string, hours: IOperatingHours) => {
        const updateAttempt = await this.museumModel.updateOne(
            { museumId, 'operatingHours.dayOfWeek': hours.dayOfWeek},
            { $set: {'operatingHours.$': hours} }
        )

        if(updateAttempt.matchedCount === 0){
            await this.museumModel.updateOne(
                { museumId },
                { $push: { operatingHours: hours } }
            )
        }
    }
    public upsertTicketPrice = async (museumId: string, ticket: ITicketPrice) => {
        const updateAttempt = await this.museumModel.updateOne(
            { museumId, 'ticketsPrices.type': ticket.type },
            { $set: {'ticketsPrices.$': ticket} }
        )

        if( updateAttempt.matchedCount === 0 ){
            await this.museumModel.updateOne(
                {museumId},
                {$set: {ticketsPrices: ticket}}
            )
        }
    }
    public removeTicketPrice = async (museumId: string, ticketType: ITicketPrice["type"]) => {
        await this.museumModel.updateOne(
            { museumId },
            { $pull: { ticketsPrices: ticketType } }
        )
    }
    public updateSubscription = async ({customerId, newSubscription, museumId, periodEnd, invoiceId}: {customerId?: string, museumId?: string, newSubscription: TSubscription, periodEnd: number, invoiceId: string}) => {
        const query: UpdateQuery<EntityMuseum> = [{
            $set: {
                subscription: newSubscription,
                subscriptionPeriodEnd: periodEnd,
                stripeInfos: { invoiceId },
                isActive: {
                    $cond: {
                        if: { $and: [ { $not: ["$subscription"] }, { $ne: [newSubscription, undefined] } ] },
                        then: true, // Caso 1: Estava sem assinatura e agora tem -> true
                        else: {
                            $cond: {
                                if: { $eq: [newSubscription, undefined] },
                                then: false, // Caso 2: Agora a assinatura é undefined -> false
                                else: "$isActive" // Caso 3: Upgrade/downgrade -> mantém o valor atual
                            }
                        }
                    }
                }
            }
        }]
        const museum = await this.museumModel.findOneAndUpdate(
            museumId ? { museumId } : { stripeInfos: { museumCustomerId: customerId } },
            query,
            { new: true }
        ).lean()
        return museum
    }
    public addExternalLink = async (museumId: string, link: IExternalLink) => {
        await this.museumModel.updateOne(
            { museumId },
            { $push: {externalLinks: link} }
        )
    }
    public updateExternalLink = async (museumId: string, linkId: string, linkData: Partial<IExternalLink>) => {

        const fieldsToUpdate: any = {};
        for (const key in linkData) {
            fieldsToUpdate[`externalLinks.$.${key}`] = (linkData as any)[key]
        }

        await this.museumModel.updateOne(
            { museumId, 'externalLinks._id': linkId },
            { $set: fieldsToUpdate }
        )
    }
    public removeExternalLink = async (museumId: string, linkId: string) => {
        await this.museumModel.updateOne(
            { museumId },
            { $pull: { externalLinks: { _id: linkId } } }
        )
    }
    public updateMuseumCustomerId = async (museumId: string, museumCustomerId: string) =>{
        await this.museumModel.updateOne(
            { museumId },
            { $set: { stripeInfos: { museumCustomerId} } }
        )
    }
    public addAccessibilityFeature = async (museumId: string, feature: TAccessibilityFeature)=>{
        await this.museumModel.updateOne(
            { museumId },
            { $push: {accessibilityFeatures: feature} }
        )
    }
    public removeAccessibilityFeature = async (museumId: string, feature: TAccessibilityFeature)=>{
        await this.museumModel.updateOne(
            { museumId },
            { $pull: {accessibilityFeatures: feature} }
        )
    }
    public updateAllArrays = async (museumId: string, arrays: MuseumDatasArray)=>{
        await this.museumModel.updateOne(
            { museumId },
            { $set: arrays }
        )
    }
    public updateEmailVerified = async (museumId: string, status: boolean)=>{
        await this.museumModel.updateOne(
            { museumId },
            { $set: { verifiedEmail: status } }
        )
    }
}