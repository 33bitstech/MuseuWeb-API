

export interface EntityUser {
    userId: string
    email: string
    name: string
    password?: string

    isGoogleAuth: boolean

    profileImg: string

    accountStatus:{
       isBanned: boolean,
       message?: string
    }

    favItens: string[] //item id
    favMuseums: string[] // museum id
}