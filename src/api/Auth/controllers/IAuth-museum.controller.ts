import { NextFunction, Request, Response } from "express"

export default interface IAuthMuseumControllerContract {
    loginMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    completeLoginMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    
    registerMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    completeRegisterMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>

    getLoggedMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>

    changePasswordMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    completeChangePasswordMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    changeEmailMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    completeChangeEmailMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    
    verifyEmailMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    completeVerifyEmailMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>

    recoveryPasswordMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
    recoveryPasswordChangeMuseum: (req:Request, res: Response, next: NextFunction) => Promise<void>
}