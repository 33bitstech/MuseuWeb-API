import { NextFunction, Request, Response } from "express"
import { ErrorsGlobal } from "../errors/errors-global"
import { decodeToken } from "../utils/jwt"
import MuseumPayloadToken from "../api/Auth/interfaces/museum-payload-token"
import { museumRepository } from "../api/Museum/routes/museum.route"
import HttpStatus from "../utils/httpStatus"
import CuratorPayloadToken from "../api/Auth/interfaces/curator-payload-token"
import { curatorRepository } from "../api/Curator/routes/curator.routes"
import { userRepository } from "../api/User/routes/user.routes"
import UserPayloadToken from "../api/Auth/interfaces/user-payload-token"

export async function manageAuthorization(req: Request) {
    const { authorization } = req.headers

    if(!authorization) throw new ErrorsGlobal('Autorização não fornecida', HttpStatus.UNAUTHORIZED.code, 'Envie o token para realizar essa ação')

    let [ , token] = authorization.split(' ')
    if(!token) throw new ErrorsGlobal('Autorização não fornecida', HttpStatus.UNAUTHORIZED.code, 'Envie o token para realizar essa ação')

    return await decodeToken(token)
}

//museus middlewares
export async function museumAuth (req: Request, res: Response, next: NextFunction) {
    try {
        const tokendecoded = await manageAuthorization(req) as MuseumPayloadToken

        const museum = await museumRepository.findById(tokendecoded.museumId)

        if (!museum) throw new ErrorsGlobal('Ocorreu um erro ao acessar o museu', 500)
        if (museum) req.museum = museum

        next()

    } catch (error: any) {
        next(error)
    }
}
export async function museumIsActiveAuth (req: Request, res: Response, next: NextFunction) {
    try {
        const tokendecoded = await manageAuthorization(req) as MuseumPayloadToken

        const museum = await museumRepository.findById(tokendecoded.museumId)

        if (!museum) throw new ErrorsGlobal('Esse museu não existe', HttpStatus.NOT_FOUND.code)
        if (!museum.isActive || !museum.subscription ) throw new ErrorsGlobal('Esse museu não possui uma assinatura ativa', HttpStatus.METHOD_NOT_ALLOWED.code)
        if (museum) req.museum = museum

        next()

    } catch (error: any) {
        next(error)
    }
}
export async function museumIsEmailActiveAuth (req: Request, res: Response, next: NextFunction) {
    try {
        const tokendecoded = await manageAuthorization(req) as MuseumPayloadToken

        const museum = await museumRepository.findById(tokendecoded.museumId)

        if ( !museum ) throw new ErrorsGlobal('Esse museu não existe', HttpStatus.NOT_FOUND.code)
        if ( !museum.verifiedEmail ) throw new ErrorsGlobal('O email precisa estar verificado para realizar esta ação', HttpStatus.METHOD_NOT_ALLOWED.code)
        if (museum) req.museum = museum

        next()

    } catch (error: any) {
        next(error)
    }
}
export async function museumIsEmailNotActiveAuth (req: Request, res: Response, next: NextFunction) {
    try {
        const tokendecoded = await manageAuthorization(req) as MuseumPayloadToken

        const museum = await museumRepository.findById(tokendecoded.museumId)

        if ( !museum ) throw new ErrorsGlobal('Esse museu não existe', HttpStatus.NOT_FOUND.code)
        if ( museum.verifiedEmail ) throw new ErrorsGlobal('Esse email ja está verificado', HttpStatus.CONFLICT.code)
        if (museum) req.museum = museum

        next()

    } catch (error: any) {
        next(error)
    }
}

//curadores middlewares
export async function curatorAuth (req: Request, res: Response, next: NextFunction) {
    try {
        const tokendecoded = await manageAuthorization(req) as CuratorPayloadToken

        const curator = await curatorRepository.findById(tokendecoded.curatorId)

        if (!curator) throw new ErrorsGlobal('Ocorreu um erro ao acessar o curador', 500)
        if (curator) req.curator = curator

        next()

    } catch (error: any) {
        next(error)
    }
}
export async function userAuth (req: Request, res: Response, next: NextFunction) {
    try {
        const tokendecoded = await manageAuthorization(req) as UserPayloadToken

        const user = await userRepository.findById(tokendecoded.userId)

        if (!user) throw new ErrorsGlobal('Ocorreu um erro ao acessar o usuario', 500)
        if (user) req.user = user

        next()
    } catch (error: any) {
        next(error)
    }
}