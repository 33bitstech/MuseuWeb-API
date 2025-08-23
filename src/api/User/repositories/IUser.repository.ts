

import { EntityUser } from "../entities/user";

export default interface IUserContract{
    create: (userObject: EntityUser) => Promise<EntityUser>;

    findByEmail: (email: string) => Promise<EntityUser | null>;
    findById: (userId: string) => Promise<EntityUser | null>;
    findByGoogleId: (googleId: string) => Promise<EntityUser | null>;

    update: (userId: string, dataToUpdate: Partial<Omit<EntityUser, 'userId' | 'email' | 'isGoogleAuth' | 'accountStatus' | 'favItens' | 'favMuseums'>>) => Promise<EntityUser | null>
    delete: (userId: string) => Promise<void>

    updateEmail: (userId: string, email: string) => Promise<EntityUser | null>
    updatePassword: (userId: string, newHashedPassword: string) => Promise<void>;
    updateAccountStatus: (userId: string, status: EntityUser['accountStatus']) => Promise<EntityUser | null>;
    updateGoogleId: (email: string, googleId: string) => Promise<void>

    addFavoriteItem: (userId: string, itemId: string) => Promise<void>;
    removeFavoriteItem: (userId: string, itemId: string) => Promise<void>;
    addFavoriteMuseum: (userId: string, museumId: string) => Promise<void>;
    removeFavoriteMuseum: (userId: string, museumId: string) => Promise<void>;
}