import mongoose, { Schema } from 'mongoose'
import { EntityItem } from '../entities/item'
import { TMuseum } from '../entities/museum'

const museumTypes: TMuseum[] = [
    'História', 'Militar', 'Arte', 'Arqueologia', 
    'Ciências e Tecnologia', 'Musica', 'Bibliografia', 'Geral'
]


const OriginSchema = new Schema({
    country: { type: String },
    city: { type: String },
    originalLocation: { type: String }
}, { _id: false }) 

const CreationDateSchema = new Schema({
    year: { type: Number },
    month: { type: Number },
    day: { type: Number }
}, { _id: false })

const DimensionsSchema = new Schema({
    height: { type: Number },
    width: { type: Number },
    depth: { type: Number },
    weight: { type: Number },
    unit: { type: String },
    description: { type: String }
}, { _id: false })

const ImageSchema = new Schema({
    url: { type: String, required: true },
    description: { type: String },
    credits: { type: String }
}, { _id: true }) 

const DocumentSchema = new Schema({
    url: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String }
}, { _id: true })


const ItemSchema = new Schema<EntityItem>({
    itemId: { type: String, required: true, unique: true, index: true },
    museumId: { type: String, required: true, index: true },
    
    title: { type: String, required: true, index: true },
    descriptionShort: { type: String, required: true },
    descriptionLong: { type: String, required: true },

    museumType: { type: String, required: true, enum: museumTypes },
    category: { type: String, required: true, index: true },
    inventoryNumber: { type: String, required: true },
    collection: { type: String, index: true },
    tags: { type: [String], index: true },

    period: { type: String, index: true },
    itemType: { type: String },
    material: { type: String, index: true },
    technique: { type: String },

    origin: { type: OriginSchema },
    actualLocation: { type: String },
    itemCondition: { type: String },

    creationDate: { type: CreationDateSchema },
    acquisitionDate: { type: Date },

    author: { type: String, index: true },
    provenance: { type: String },
    history: { type: String },

    dimensions: { type: DimensionsSchema },

    images: { type: [ImageSchema], required: true },
    documents: { type: [DocumentSchema], default: [] },
    
    bibliographicReferences: { type: [String], default: [] },
    copyright: { type: String },
    totalSize: { type: Number }
    
}, {
    timestamps: true 
})

ItemSchema.index({ museumId: 1, inventoryNumber: 1 }, { unique: true })
ItemSchema.index({
    title: 'text',
    descriptionShort: 'text',
    category: 'text',
    tags: 'text',
    author: 'text'
})

export const ItemModel = mongoose.model<EntityItem>(
    'item', 
    ItemSchema
)