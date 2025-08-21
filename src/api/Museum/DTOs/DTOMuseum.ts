import { EntityMuseum } from "../entities/museum";

export interface DTOMuseumLoginCredentials{
    email: string,
    password: string,
    cnpj: string
}
export type DTOMuseumCompleteRegister = Omit<
    EntityMuseum,
    | 'museumId'
    | 'cnpj'
    | 'password'
    | 'email'
    | 'isActive'
    | 'rating'
    | 'stripeInfos'
    | 'subscription'
    | 'subscriptionPeriodEnd'
>
export type MuseumProfileData = Partial<Pick<EntityMuseum, 
    "name" | "descriptionShort" | "descriptionLong" | "address" | "history" | 
    "logoImageUrl" | "coverImageUrl" | "type" | "isOpenToPublic" | 
    "specialNotesHours" | 'museumSite'
>>
export type MuseumDatasArray = Partial<Pick<
    EntityMuseum,
    | 'accessibilityFeatures'
    | 'gallery'
    | 'externalLinks'
    | 'affiliated'
    | 'ticketsPrices'
    | 'operatingHours'
>>
export type PublicMuseumAuthenticated = Omit<
    EntityMuseum,
    | 'password'
    | 'stripeInfos'
>