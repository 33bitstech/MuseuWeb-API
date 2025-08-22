export default interface UserPayloadToken {
    userId: string
    email: string
    profileImg?: string,
    isGoogleAuth: boolean
    isBanned: boolean,
    iat: number
}