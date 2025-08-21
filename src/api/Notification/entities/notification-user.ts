import { DefaultNotification } from "./notification-default"

type TypeNotification =
    | "COMMENT"
    | "SYSTEM"


export interface EntityNotificationUser extends DefaultNotification{
    userId: string
    type: TypeNotification
    action?: string
    url?: string
}