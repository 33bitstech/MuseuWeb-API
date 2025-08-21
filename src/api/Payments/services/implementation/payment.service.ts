import { ErrorsGlobal } from "../../../../errors/errors-global"
import { stripe } from "../../../../server"
import HttpStatus from "../../../../utils/httpStatus"
import { TSubscription } from "../../../Museum/entities/museum"
import { MuseumRepository } from "../../../Museum/repositories/implementation/museum.repository"
import IPaymentServiceContract from "../IPayment.service"
import stripeConfig, { Stripe } from 'stripe'

export class PaymentService implements IPaymentServiceContract{
    constructor(
        private readonly museumRepository: MuseumRepository
    ){}

    public getProductsPrice = async () => {
        return await stripe.prices.list({
            active: true,
            expand: ['data.product']
        })
    }

    public createCustomer = async (id: string) =>{
        return await stripe.customers.create({
            metadata: { _id: id }
        })
    }

    public generateMuseumSession = async (priceId: string, museumId: string, museumCustomerId?: string) => {
        if ( !museumCustomerId ) {
            const customer = await this.createCustomer(museumId)

            museumCustomerId = customer.id
            await this.museumRepository.updateMuseumCustomerId(museumId, museumCustomerId)
        }

        const session = await stripe.checkout.sessions.create({
            line_items: [
                { price: priceId, quantity: 1 }
            ],
            customer: museumCustomerId,
            ui_mode: 'hosted',
            mode: 'subscription',
            success_url: process.env.STRIPE_SUCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
            metadata: { museumId }
        })

        return session
    }

    public getSubscriptionByPriceId = async (priceId: string) => {
        const price = await stripe.prices.retrieve(priceId, {
            expand: ['product']
        })
        return price.product as Stripe.Product
    }

    public webhookEventsHandler = async (body: any, signature: string | string[]) => {
        const event = await stripe.webhooks.constructEventAsync(
            body, signature,
            process.env.STRIPE_ENDPOINT_SECRET as string
        )
        switch (event.type) {
            case 'checkout.session.completed':{
                const sessionId = event.id
                await this.handleSuccessfullyPayment(sessionId)
                break
            }
            case 'invoice.paid': {
                const invoice = event.data.object as stripeConfig.Invoice
                const invoiceId = invoice.id!

                const hasSubscriptionAlreadyProcessed = await this.museumRepository.findByInvoiceId(invoiceId)
                if ( hasSubscriptionAlreadyProcessed ) break
                
                if (invoice.billing_reason === 'subscription_create' || invoice.billing_reason === 'subscription_cycle') {
                    const customerId = invoice.customer as string
                    const periodEnd = invoice.lines.data[0].period.end as number
                    const priceId = invoice.lines.data[0].pricing?.price_details?.price as string
    
                    const subscription = await this.getSubscriptionByPriceId(priceId) 
    
                    await this.museumRepository.updateSubscription({
                        periodEnd,
                        invoiceId,
                        customerId, 
                        newSubscription: subscription.name as TSubscription
                    })
                }
                console.log('Pagamento recebido! Acesso concedido/renovado.')
                break
            }

            case 'customer.subscription.updated': {
                // Usado para tratar mudanças de status intermediárias
                const subscription = event.data.object as stripeConfig.Subscription
                const userId = subscription.metadata.userId

                if (subscription.status === 'past_due') {
                    // Acesso deve ser RESTRINGIDO, não cancelado.
                    console.log('Pagamento atrasado. Restringindo acesso do usuário ' + userId)
                    //await User.setPremium(userId, false, 'past_due') // Ex: função que atualiza o status
                }

                break
            }

            case 'customer.subscription.deleted': {
                // Agora sim, cancelar permanentemente!
                const subscription = event.data.object as stripeConfig.Subscription
                const userId = subscription.metadata.userId

                console.log('Assinatura cancelada definitivamente. Removendo acesso do usuário ' + userId)
                //await subscriptions.updateSubscription(subscription.id, userId, 'canceled')
                //await User.setPremium(userId, false)
                break;
            }
            
            default:
        }
    }

    public handleSuccessfullyPayment = async (sessionId: string) =>{
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['subscription', 'invoice'],
        });

        if (session.status !== 'complete' || !session.invoice || !session.subscription){
            throw new ErrorsGlobal(`A sessão de checkout ${sessionId} não foi concluída com sucesso ou não gerou uma fatura/assinatura.`, HttpStatus.NOT_IMPLEMENTED.code)
        }

        const invoice = session.invoice as stripeConfig.Invoice

        if (invoice.status !== 'paid') throw new ErrorsGlobal(`O pagamento para a fatura ${invoice.id} falhou. Status: ${invoice.status}`, HttpStatus.INTERNAL_SERVER_ERROR.code)

        const invoiceId = invoice.id!
        const alreadyProcessed = await this.museumRepository.findByInvoiceId(invoiceId)
        if (alreadyProcessed) return

        const customerId = invoice.customer as string
        const periodEnd = invoice.lines.data[0].period.end as number
        const priceId = invoice.lines.data[0].pricing?.price_details?.price as string

        const subscription = await this.getSubscriptionByPriceId(priceId) 

        await this.museumRepository.updateSubscription({
            periodEnd,
            invoiceId,
            customerId, 
            newSubscription: subscription.name as TSubscription
        })
    }
}