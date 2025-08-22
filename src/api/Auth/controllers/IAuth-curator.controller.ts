import { NextFunction, Request, Response } from "express"

export default interface IAuthCuratorControllerContract {
    curatorLogin: (req: Request, res: Response, next:NextFunction)=>Promise<void>
    curatorRegister: (req: Request, res: Response, next:NextFunction)=>Promise<void>
    getLoggedCurator: (req: Request, res: Response, next:NextFunction)=>Promise<void>
}