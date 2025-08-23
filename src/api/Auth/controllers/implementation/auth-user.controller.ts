import { Request, Response, NextFunction } from "express";
import { AuthCuratorService } from "../../services/implementation/auth-curator.service";
import HttpStatus from "../../../../utils/httpStatus";
import IAuthUserControllerContract from "../IAuth-user.controller";
import { TCreateUserBody } from "../../../User/DTOs/DTOUser";
import { AuthUserService } from "../../services/implementation/auth-user.service";
import { EntityUser } from "../../../User/entities/user";

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
    public logWithGoogle = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const { user } = req
            const token = await this.authService.createUserToken(user as EntityUser)

            res.status(HttpStatus.ACCEPTED.code).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <script>
                        window.opener.postMessage({ 
                            type: 'auth-success', 
                            token: '${token}' 
                        }, '${process.env.FRONTEND_URL}');

                        // Fecha o popup
                        window.close();
                    </script>
                </head>
                <body>
                    Redirecionando...
                </body>
                </html>
            `)

        } catch (err) {
            res.status(500).send(`
                <!DOCTYPE html><html><head><script>
                    window.opener.postMessage({ type: 'auth-error' }, '*');
                    window.close();
                </script></head><body>Erro.</body></html>
            `)
        }
    }
    public getLoggedUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user: userDecoded } = req

            const user = await this.authService.authenticated(userDecoded as EntityUser)

            res.status(HttpStatus.OK.code).send({user})
        } catch (err) {
            next(err)
        }
    }
}