import { NextFunction, Request, Response } from "express"
import HttpStatus from "../../../../utils/httpStatus"
import IPaymentControllerContract from "../IPayment.controller"
import { PaymentService } from "../../services/implementation/payment.service"
import { ErrorsGlobal } from "../../../../errors/errors-global"
import { stripe } from "../../../../server"
import stripeConfig from "stripe";

export class PaymentController implements IPaymentControllerContract{
    constructor(
        private readonly paymentService: PaymentService
    ){}

    public createCheckoutSection = async(req: Request, res: Response, next: NextFunction)=>{
        try {
            const { priceId } = req.body
            const { museumId, stripeInfos } = req.museum!

            const [ session, product ] = await Promise.all([
                this.paymentService.generateMuseumSession(priceId, museumId, stripeInfos?.museumCustomerId),
                this.paymentService.getSubscriptionByPriceId(priceId)
            ])
            
            res.status(HttpStatus.OK.code).send({
                sessionId: session.id, 
                stripeUrl: session.url,
                productName: product.name,
                productImages: product.images,
                productDescription: product.description,
                productType: product.type,
                subTotalInCents: session.amount_subtotal,
                totalInCents: session.amount_total,
                sucessUrl: session.success_url,
                cancelUrl: session.cancel_url
            })
            
        } catch (err) {
            next(err)
        }
    }

    public getProductsPrices = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const prices = await this.paymentService.getProductsPrice()
            
            res.status(HttpStatus.OK.code).send({prices: prices.data})
        } catch (err) {
            next(err)
        }
    }

    public stripeWebhook = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const signature = req.headers['stripe-signature']

            if (!signature) throw new ErrorsGlobal('Stripe header not set', 500)
                
            await this.paymentService.webhookEventsHandler(req.body, signature)

            res.status(200).send({ received: true });
        } catch (err) {
            next(err)
        }
    }
    public buySubscription = async (req: Request, res: Response, next: NextFunction)=>{
        try {
            const { sessionId } = req.body
            if( !sessionId ) throw new ErrorsGlobal('Envie a sessionId', HttpStatus.BAD_REQUEST.code)

            await this.paymentService.handleSuccessfullyPayment(sessionId)

            res.status(HttpStatus.ACCEPTED.code).send({status:'payed'})
        } catch (err) {
            next(err)
        }
    }

}