import { IHistoricDefault } from "./history-default";

type TypeAction = 
    | "DELETE"
    | "UPDATE"
    | "POST"

export interface EntityHistoryMuseum extends IHistoricDefault {
    museumId: string
    action: TypeAction
}