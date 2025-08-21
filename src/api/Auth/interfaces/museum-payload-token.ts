export default interface MuseumPayloadToken {
    museumId: string
    email: string
    name?: string
    subscription?: string
    subscriptionPeriodEnd?: Date
    logoUrl?: string
    coverUrl?: string
    iat: number
}