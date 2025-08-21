import { DefaultNotification } from "./notification-default"

type TypeNotification =
    | "COMMENT"
    | "SYSTEM"


export interface EntityNotificationCurator extends DefaultNotification{
    curatorId: string
    type: TypeNotification
    action?: string
    url?: string
}