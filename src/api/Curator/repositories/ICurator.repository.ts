import { EntityCurator } from "../entities/curator";

export default interface ICuratorRepository {
    create: (data: EntityCurator) => Promise<EntityCurator>;
    
    findById: (curatorId: string) => Promise<EntityCurator | null>;
    
    findByEmail: (email: string) => Promise<EntityCurator | null>;
    
    update: (curatorId: string, dataToUpdate: Partial<Omit<EntityCurator, 'curatorId' | 'email'>>) => Promise<EntityCurator | null>;

    updateEmail: (curatorId: string, email: string) => Promise<EntityCurator | null>

    updatePassword: (curatorId: string, newHashedPassword: string) => Promise<void>;
    
    delete: (curatorId: string) => Promise<void>;
    
    findAllByMuseumId: (museumId: string) => Promise<EntityCurator[]>;
    
    findAll: () => Promise<EntityCurator[]>;
}