

export interface EntityStatementEntry {
    statementId?: string;
    museumId: string; // Dono do extrato

    type: "credit" | "debit"; // Entrada ou saída
    category: "payment" | "refund" | "bonus" | "adjustment" | "withdraw";
    amountInCents: number;
    currency: string;

    relatedPaymentId?: string; // Link para o pagamento correspondente
    description?: string;

    balanceAfterTransaction?: number; // Saldo final após essa movimentação

    createdAt: Date;
}
