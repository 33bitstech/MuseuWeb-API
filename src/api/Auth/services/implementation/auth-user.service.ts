import { v4 } from "uuid";
import { ErrorsGlobal } from "../../../../errors/errors-global";
import { compareStringToHash, createHash } from "../../../../utils/bcript";
import HttpStatus from "../../../../utils/httpStatus";
import { signToken } from "../../../../utils/jwt";
import IAuthUserServiceContract from "../IAuth-user.service";
import { UserRepository } from "../../../User/repositories/implementation/user.repository";
import UserPayloadToken from "../../interfaces/user-payload-token";
import { EntityUser } from "../../../User/entities/user";
import { PublicUserAuthenticated, TCreateUserBody } from "../../../User/DTOs/DTOUser";
import { MuseumRegisterCases } from "../../use-cases/implementation/uc-museum-register";

export class AuthUserService implements IAuthUserServiceContract{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly useCaseMuseumRegister: MuseumRegisterCases
    ){}

    private createUserToken = async (user: EntityUser) =>{
        const iat = Math.floor(Date.now() / 1000)

        return await signToken({
            userId: user.userId,
            email: user.email,
            isGoogleAuth: user.isGoogleAuth,
            profileImg: user.profileImg,
            isBanned: user.accountStatus.isBanned,
            iat
        } as UserPayloadToken, '5d') as string
    }

    public authenticated = async (user: EntityUser) => {
        const userInDatabase = user as Partial<EntityUser>

        delete userInDatabase.password
        delete userInDatabase.isGoogleAuth

        return userInDatabase as PublicUserAuthenticated
    }
    public register = async (userObject: TCreateUserBody) => {

        const isEmailInDatabase = await this.useCaseMuseumRegister.verifyExistEmail(userObject.email)
        if ( isEmailInDatabase ) throw new ErrorsGlobal('Esse email ja foi cadastrado no sistema', HttpStatus.BAD_REQUEST.code)

        const passwordHashed = await createHash(15, userObject.password!) as string

        const user = await this.userRepository.create({
            password: passwordHashed,
            userId: `uid_${v4()}`,
            name: userObject.name,
            accountStatus:{
                isBanned: false
            },
            email: userObject.email,
            profileImg: userObject.profileImg,
            favItens: [],
            favMuseums: [],
            isGoogleAuth: false
        })

        return await this.createUserToken(user)
    }
    public login = async ({ email, password }: { email: string; password: string; }) => {
        const user = await this.userRepository.findByEmail(email)
        if ( !user ) throw new ErrorsGlobal('Email ou Senha invalidos', HttpStatus.CONFLICT.code)

        const isPasswordCorrect = await compareStringToHash(password, user.password!)

        if ( !isPasswordCorrect ) throw new ErrorsGlobal('Email ou Senha invalidos', HttpStatus.FORBIDDEN.code)
    
        return await this.createUserToken(user)
    }
}