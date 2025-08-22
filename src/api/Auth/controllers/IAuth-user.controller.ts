import { NextFunction, Request, Response } from "express"

export default interface IAuthUserControllerContract {
    userLogin: (req: Request, res: Response, next:NextFunction)=>Promise<void>
    userRegister: (req: Request, res: Response, next:NextFunction)=>Promise<void>
    getLoggedUser: (req: Request, res: Response, next:NextFunction)=>Promise<void>
}