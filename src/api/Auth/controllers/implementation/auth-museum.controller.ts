
import { Request, Response, NextFunction } from 'express';
import IAuthControllerContract from '../IAuth-museum.controller'
import HttpStatus from '../../../../utils/httpStatus';
import { AuthMuseumService } from '../../services/implementation/auth-museum.service';
import { DTOMuseumCompleteRegister } from '../../../Museum/DTOs/DTOMuseum';

export class AuthMuseumController implements IAuthControllerContract {
    constructor(
        private authService: AuthMuseumService
    ){}

    public loginMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {identifier, password} = req.body
            
            const {token, museumId, message} = await this.authService.museumLogin(identifier, password)

            res.status(HttpStatus.ACCEPTED.code).send({token, museumId, message})
        } catch (err) {
            next(err)
        }
    }
    public completeLoginMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {museumId, otp} = req.body
            
            const token = await this.authService.completeMuseumLogin(museumId, otp)

            res.status(HttpStatus.ACCEPTED.code).send({token})
        } catch (err) {
            next(err)
        }
    }
    public registerMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { cnpj, email, password } = req.body

            const museumToken = await this.authService.museumRegister({cnpj, email, password})

            res.status(HttpStatus.CREATED.code).send({token: museumToken})

        } catch (err) {
            next(err)
        }
    }
    public completeRegisterMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { museum } = req
            const museumData: Partial<DTOMuseumCompleteRegister> = req.body

            const token = await this.authService.completeMuseumRegister(museum?.museumId!, museumData)

            res.status(HttpStatus.CREATED.code).send({token})
        } catch (err) {
            next(err)
        }
    }

    public getLoggedMuseum = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const { museum: museumDecoded } = req

            const museum = await this.authService.museumAuthenticated(museumDecoded?.museumId!)

            res.status(HttpStatus.OK.code).send({museum})
        } catch (err) {
            next(err)
        }
    }
    public changeEmailMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body
            const { museum } = req

            const { message } = await this.authService.updateMuseumEmail(museum?.museumId!, email)

            res.status(HttpStatus.OK.code).send({message})

        } catch (err) {
            next(err)
        }
    }
    public completeChangeEmailMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { museum } = req
            const { otp } = req.body

            const token = await this.authService.completeUpdateEmailMuseum(museum?.museumId!, otp)

            res.status(HttpStatus.ACCEPTED.code).send({message: "Email alterado com sucesso", token})
        } catch (err) {
            next(err)
        }
    }
    public changePasswordMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { password } = req.body
            const { museum } = req

            const { message } = await this.authService.updateMuseumPassword(museum?.museumId!, password)

            res.status(HttpStatus.OK.code).send({message})

        } catch (err) {
            next(err)
        }
    }
    public completeChangePasswordMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { museum } = req
            const { otp } = req.body

            await this.authService.completeUpdatePasswordMuseum(museum?.museumId!, otp)

            res.status(HttpStatus.ACCEPTED.code).send({message: "Senha alterada com sucesso"})
        } catch (err) {
            next(err)
        }
    }
    public verifyEmailMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { museum } = req

            const { message } = await this.authService.verifyMuseumEmail(museum!)
            
            res.status(HttpStatus.ACCEPTED.code).send({message})
        } catch (err) {
            next(err)
        }
    }
    public completeVerifyEmailMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.body
            
            await this.authService.completeVerifyMuseumEmail(token)

            res.status(HttpStatus.ACCEPTED.code).send({ message:'Seu email foi verificado com sucesso!' })
        } catch (err) {
            next(err)
        }
    }
    public recoveryPasswordMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body

            await this.authService.recoveryPasswordMuseum(email)
            
            res.status(HttpStatus.ACCEPTED.code).send({message: "Verifique seu email"})
        } catch (err) {
            next(err)
        }
    }
    public recoveryPasswordChangeMuseum = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, password } = req.body
            
            await this.authService.recoveryPasswordChangeMuseum(token, password)

            res.status(HttpStatus.ACCEPTED.code).send({ message:'Senha alterada com sucesso!' })
        } catch (err) {
            next(err)
        }
    }
    
}