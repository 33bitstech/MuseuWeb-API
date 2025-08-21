import { Schema, model } from 'mongoose'
import { EntityCurator } from '../entities/curator'


const curatorSchema = new Schema<EntityCurator>({
    curatorId: {
        type: String,
        required: true,
        unique: true,
        index: true 
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
        required: true,
    },
    
    museumId: {
        type: String,
        ref: 'museum',
        required: true,
        index: true
    },

    curatorImg: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


export const CuratorModel = model<EntityCurator>(
    'curator', 
    curatorSchema
)