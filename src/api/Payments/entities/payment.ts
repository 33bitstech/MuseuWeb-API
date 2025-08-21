
export default interface EntityPayment {
    paymentId?: string;
    museumId: string; // ID do usuário pagante
    amountInCents: number; // Valor em centavos
    currency: string; // "BRL", "USD", etc.

    // Informações do método de pagamento
    method: "credit_card" | "pix" | "boleto" | "paypal" | "bank_transfer";
    status: "pending" | "paid" | "failed" | "refunded" | "canceled";
    transactionId?: string; // ID no gateway de pagamento
    gateway?: string; // Ex: "Stripe", "MercadoPago"

    description?: string; // Descrição curta do pagamento
    metadata?: Record<string, any>; // Dados extras para rastreio

    createdAt: Date;
    updatedAt?: Date;
}
