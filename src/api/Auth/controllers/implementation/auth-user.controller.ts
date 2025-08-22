import { Request, Response, NextFunction } from "express";
import { AuthCuratorService } from "../../services/implementation/auth-curator.service";
import HttpStatus from "../../../../utils/httpStatus";
import IAuthUserControllerContract from "../IAuth-user.controller";
import { TCreateUserBody } from "../../../User/DTOs/DTOUser";
import { AuthUserService } from "../../services/implementation/auth-user.service";

export class AuthUserController implements IAuthUserControllerContract {
    constructor(
        private readonly authService: AuthUserService
    ){}

    public userLogin = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body

            const token = await this.authService.login({email, password})

            res.status(HttpStatus.OK.code).send({token})
        } catch (err) {
            next(err)
        }
    }
    public userRegister = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userObject = req.body as TCreateUserBody

            const token = await this.authService.register(userObject)

            res.status(HttpStatus.OK.code).send({token})
        } catch (err) {
            next(err)
        }
    }
    public getLoggedUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user: userDecoded } = req

            const user = await this.authService.authenticated(userDecoded!)

            res.status(HttpStatus.OK.code).send({user})
        } catch (err) {
            next(err)
        }
    }
}