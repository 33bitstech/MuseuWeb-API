import { EntityItem } from "../entities/item";

export interface IItemSearchFilters {
    museumId?: string; 
    title?: string;
    category?: string;
    collection?: string;
    period?: string;
    author?: string;
    material?: string;
    tags?: string[];
}

export default interface IItemRepositoryContract {
    create: (data: Omit<EntityItem, | 'createdAt' | 'updatedAt'>) => Promise<EntityItem>;
    findById: (itemId: string) => Promise<EntityItem | null>
    findByInventoryNumber: (museumId: string, inventoryNumber: string) => Promise<EntityItem | null>;
    delete: (itemId: string) => Promise<void>;
    deleteAllByMuseum: (museumId: string) => Promise<void>

    updateItemInfo: (itemId: string, data: Partial<Pick<EntityItem, 'title' | 'descriptionShort' | 'descriptionLong' | 'category' | 'collection' | 'period' | 'itemType' | 'material' | 'technique' | 'origin' | 'actualLocation' | 'itemCondition' | 'author' | 'provenance' | 'history' | 'dimensions' | 'copyright'>>) => Promise<void>;

    updateTotalsize: (itemId: string, totalSize:number) => Promise<void>


    addTag: (itemId: string, tag: string) => Promise<void>;
    removeTag: (itemId: string, tag: string) => Promise<void>;

    addImage: (itemId: string, image: EntityItem['images'][number]) => Promise<void>;
    removeImage: (itemId: string, imageId: string) => Promise<void>;
    
    addDocument: (itemId: string, document: NonNullable<EntityItem['documents']>[number]) => Promise<void>;
    removeDocument: (itemId: string, documentId: string) => Promise<void>;

    search: (filters: IItemSearchFilters, page: number, limit: number) => Promise<{ items: EntityItem[], total: number }>;
    findAllByMuseum: (museumId: string, page: number, limit: number) => Promise<{ items: EntityItem[], total: number }>;
    findAll: (page: number, limit: number) => Promise<{ items: EntityItem[], total: number }>;
    findRecentlyAddedByMuseum: (museumId: string, limit: number) => Promise<EntityItem[]>;
}