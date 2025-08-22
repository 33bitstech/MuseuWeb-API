import { EntityUser } from "../entities/user";

export type TCreateUserBody = Omit<EntityUser, 'accountStatus' | 'userId' | 'isGoogleAuth' | 'favItens' | 'favMuseums'>

export type PublicUserAuthenticated = Omit<
    EntityUser,
    | 'password'
    | 'isGoogleAuth'
>