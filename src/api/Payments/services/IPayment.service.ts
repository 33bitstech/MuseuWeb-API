import Stripe from "stripe";

export default interface IPaymentServiceContract{
    getProductsPrice: () => Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>>

    generateMuseumSession: (priceId: string, museumId: string, museumCustomerId?: string) => Promise<Stripe.Response<Stripe.Checkout.Session>>

    getSubscriptionByPriceId: (priceId: string) => Promise<Stripe.Product>

    createCustomer: (id: string) => Promise<Stripe.Response<Stripe.Customer>>

    webhookEventsHandler: (body: any, signature: string | string[]) => Promise<void>
    handleSuccessfullyPayment: (sessionId: string) => Promise<void>
}