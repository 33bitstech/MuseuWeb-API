import { Request } from "express"
import { EntityUser } from "../api/User/entities/user"
import { EntityMuseum } from "../api/Museum/entities/museum"
import { EntityCurator } from "../api/Curator/entities/curator"

declare global {
    namespace Express {
        export interface Request {
            user?: EntityUser,
            museum?: EntityMuseum,
            curator?: EntityCurator,
            file?: {
                key?: string
            },
        }
    }
}