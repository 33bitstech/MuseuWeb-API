import { PublicCuratorAuthenticated } from "../../Curator/DTOs/DTOCurator";
import { EntityCurator } from "../../Curator/entities/curator"

export default interface IAuthCuratorServiceContract {
    curatorRegister: (curatorObject: Omit<EntityCurator, 'curatorId'>) => Promise<string>
    curatorLogin: ({ name, password, museumId}: { name: string, password: string, museumId:string}) => Promise<string>

    curatorAuthenticated: (curator: EntityCurator) => Promise<PublicCuratorAuthenticated>;
}