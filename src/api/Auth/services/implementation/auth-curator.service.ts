import { v4 } from "uuid";
import { ErrorsGlobal } from "../../../../errors/errors-global";
import { compareStringToHash, createHash } from "../../../../utils/bcript";
import HttpStatus from "../../../../utils/httpStatus";
import { signToken } from "../../../../utils/jwt";
import { PublicCuratorAuthenticated } from "../../../Curator/DTOs/DTOCurator";
import { EntityCurator } from "../../../Curator/entities/curator";
import { CuratorRepository } from "../../../Curator/repositories/implementation/curator.repository";
import CuratorPayloadToken from "../../interfaces/curator-payload-token";
import IAuthCuratorServiceContract from "../IAuth-curator.service";

export class AuthCuratorService implements IAuthCuratorServiceContract{
    constructor(
        private readonly curatorRepository: CuratorRepository
    ){}

    private createCuratorToken = async (curator: EntityCurator) =>{
        const iat = Math.floor(Date.now() / 1000)

        return await signToken({
            museumId:curator.museumId,
            curatorId: curator.curatorId,
            curatorImg: curator.curatorImg || '',
            name: curator.name,
            iat
        } as CuratorPayloadToken, '3d') as string
    }

    public curatorRegister = async (curatorObject: Omit<EntityCurator, 'curatorId'>) => {
        const alreadyCuratorName = await this.curatorRepository.findByName(curatorObject.name, curatorObject.museumId)
        if ( alreadyCuratorName ) throw new ErrorsGlobal('Ja existe um curador com esse nome', HttpStatus.CONFLICT.code)

        const passwordHashed = await createHash(15, curatorObject.password) as string

        const curator = await this.curatorRepository.create({
            museumId: curatorObject.museumId,
            password: passwordHashed,
            curatorId: `cid_${v4()}`,
            name: curatorObject.name,
            curatorImg: curatorObject.curatorImg
        })

        return await this.createCuratorToken(curator)
    }
    public curatorLogin = async ({ name, password, museumId}: { name: string; password: string, museumId: string }) => {
        const curator = await this.curatorRepository.findByName(name, museumId)
        if ( !curator ) throw new ErrorsGlobal('Nome ou Senha invalidos', HttpStatus.CONFLICT.code)

        const isPasswordCorrect = await compareStringToHash(password, curator.password)

        if ( !isPasswordCorrect ) throw new ErrorsGlobal('Nome ou Senha invalidos', HttpStatus.FORBIDDEN.code)
    
        return await this.createCuratorToken(curator)
    }
    public curatorAuthenticated = async (curator: EntityCurator) => {
        const curatorInDatabase = curator as Partial<EntityCurator>

        delete curatorInDatabase.password

        return curatorInDatabase as PublicCuratorAuthenticated
    }
}