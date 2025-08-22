import { Request, Response, NextFunction } from "express";
import { AuthCuratorService } from "../../services/implementation/auth-curator.service";
import IAuthCuratorControllerContract from "../IAuth-curator.controller";
import HttpStatus from "../../../../utils/httpStatus";
import { EntityCurator } from "../../../Curator/entities/curator";

export class AuthCuratorController implements IAuthCuratorControllerContract {
    constructor(
        private readonly authService: AuthCuratorService
    ){}

    public curatorLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, password, museumId } = req.body

            const token = await this.authService.curatorLogin({name, password, museumId})

            res.status(HttpStatus.OK.code).send({token})
        } catch (err) {
            next(err)
        }
    }
    public curatorRegister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const curatorObject = req.body as Omit<EntityCurator, 'curatorId'>

            const token = await this.authService.curatorRegister(curatorObject)

            res.status(HttpStatus.OK.code).send({token})
        } catch (err) {
            next(err)
        }
    }
    public getLoggedCurator = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { curator: curatorDecoded } = req

            const curator = await this.authService.curatorAuthenticated(curatorDecoded!)

            res.status(HttpStatus.OK.code).send({curator})
        } catch (err) {
            next(err)
        }
    }
}