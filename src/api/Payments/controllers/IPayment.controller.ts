import { NextFunction, Request, Response } from "express";

export default interface IPaymentControllerContract{
    createCheckoutSection: (req: Request, res: Response, next: NextFunction) => Promise<void>
    getProductsPrices: (req: Request, res: Response, next: NextFunction) => Promise<void>
    stripeWebhook: (req: Request, res: Response, next: NextFunction) => Promise<void>
}