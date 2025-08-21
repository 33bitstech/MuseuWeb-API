import { DefaultNotification } from "./notification-default"

type TypeNotification =
    | "PAYMENTS"


export interface EntityNotificationMuseum extends DefaultNotification{
    museumId: string
    type: TypeNotification
    action?: string
    url?: string
}