export type TypeHistory = 
    | "PAYMENTS"
    | "CURATOR_ACTIONS"
    | "REPORTS"
    | "FIXES"

export interface IHistoricDefault {
    historicId: string
    name: string,
    createdAt: Date,
    type: TypeHistory
    message: string
}