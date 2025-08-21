import { Router } from "express"
import { PaymentService } from "../services/implementation/payment.service"
import { PaymentController } from "../controllers/implementation/payment.controller"
import { museumRepository } from "../../Museum/routes/museum.route"
import { museumAuth } from "../../../middlewares/auth.middleware"
import { stripe } from "../../../server"
import { ErrorsGlobal } from "../../../errors/errors-global"
import Stripe from "stripe"
import HttpStatus from "../../../utils/httpStatus"
const paymentRoutes = Router()

//models

//repositories

//services
const paymentService = new PaymentService(
    museumRepository
)

//controllers
export const { createCheckoutSection, getProductsPrices, stripeWebhook, buySubscription} = new PaymentController(
    paymentService
)

paymentRoutes.get('/pricing-plans', getProductsPrices)

paymentRoutes.post('/subscriptions/create-checkout-session', museumAuth, createCheckoutSection)
paymentRoutes.post('/subscriptions/buy', museumAuth, buySubscription)

export {paymentRoutes}