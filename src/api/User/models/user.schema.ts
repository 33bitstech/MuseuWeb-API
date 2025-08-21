import { model, Schema } from "mongoose"
import { EntityUser } from "../entities/user"


const userSchema = new Schema<EntityUser>({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true // Adicionar um índice melhora a performance de buscas
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: false // Como é opcional, `required` é `false` por padrão
    },
    isGoogleAuth: {
        type: Boolean,
        default: false
    },
    profileImg: {
        type: String,
        required: true
    },
    accountStatus: {
        isBanned: {
            type: Boolean,
            default: false
        },
        message: {
            type: String,
            required: false
        }
    },
    favItens: {
        type: [String], // Define um array de strings
        default: []
    },
    favMuseums: {
        type: [String],
        default: []
    }
}, {
    timestamps: true
})

export const UserModel = model<EntityUser>(
    'user', 
    userSchema
)