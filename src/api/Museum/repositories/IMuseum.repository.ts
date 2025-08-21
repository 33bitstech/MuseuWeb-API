import { MuseumDatasArray } from "../DTOs/DTOMuseum";
import { EntityMuseum, IExternalLink, IGalleryItem, IOperatingHours, IRating, ITicketPrice, TAccessibilityFeature, TMuseum, TSubscription } from "../entities/museum";

export interface IMuseumSearchFilters {
    name?: string;
    state?: string;
    city?: string;
    type?: TMuseum;
    accessibilityFeatures?: TAccessibilityFeature[];
    minRating?: number;
    page?: number;
    limit?: number;
}

export default interface IMuseumRepositoryContract{
    findByEmail: (email:string) => Promise<EntityMuseum | null>
    create: (data: EntityMuseum) => Promise<EntityMuseum>;
    findByIdentifier:(identifier: string) => Promise<EntityMuseum | null>
    findById: (museumId: string) => Promise<EntityMuseum | null>;
    findByCnpj: (cnpj: string) => Promise<EntityMuseum | null>;
    findByCustomerId: (customerId: string) => Promise<EntityMuseum | null>;
    findByInvoiceId: (invoiceId: string) => Promise<EntityMuseum | null>;
    delete: (museumId: string) => Promise<void>;

    updateProfileInfo: (museumId: string, data: Partial<Pick<EntityMuseum, 'name' | 'descriptionShort' | 'descriptionLong' | 'address' | 'history' | 'logoImageUrl' | 'coverImageUrl' | 'type' | 'isOpenToPublic' | 'specialNotesHours' | 'museumSite'>>) => Promise<void>;

    updatePassword: (museumId: string, newHashedPassword: string) => Promise<void>;
    updateEmail: (museumId: string, newEmail: string) => Promise<void>

    addGalleryItem: (museumId: string, item: IGalleryItem) => Promise<void>;
    removeGalleryItem: (museumId: string, galleryItemId: string) => Promise<void>;

    upsertTicketPrice: (museumId: string, ticket: ITicketPrice) => Promise<void>;
    removeTicketPrice: (museumId: string, ticketType: ITicketPrice['type']) => Promise<void>;
    
    upsertOperatingHours: (museumId: string, hours: IOperatingHours) => Promise<void>;

    updateRating: (museumId: string, newRatingData: IRating) => Promise<void>;
    
    addAffiliate: (museumId: string, affiliateId: string) => Promise<void>;
    removeAffiliate: (museumId: string, affiliateId: string) => Promise<void>;

    search: (filters: IMuseumSearchFilters, page: number, limit: number) => Promise<{ museums: EntityMuseum[], total: number }>;

    findAll: (limit?: number) => Promise<EntityMuseum[]>;

    updateSubscription: ({customerId, newSubscription, museumId, invoiceId}: {customerId: string, museumId?: string, newSubscription: TSubscription, periodEnd: number, invoiceId: string}) => Promise<EntityMuseum | null>;

    addExternalLink: (museumId: string, link: IExternalLink) => Promise<void>;
    removeExternalLink: (museumId: string, linkId: string) => Promise<void>;
    updateExternalLink: (museumId: string, linkId: string, linkData: Partial<IExternalLink>) => Promise<void>;

    updateMuseumCustomerId: (museumId: string, museumCustomerId: string) => Promise<void>

    removeAccessibilityFeature: (museumId: string, feature: TAccessibilityFeature)=> Promise<void>
    addAccessibilityFeature: (museumId: string, feature: TAccessibilityFeature)=> Promise<void>

    updateAllArrays: (museumId: string, arrays: MuseumDatasArray)=>Promise<void>

    updateEmailVerified: (museumId: string, status: boolean)=>Promise<void>
}