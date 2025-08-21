import mongoose, { Schema } from 'mongoose'
import { VirtualExhibition } from '../entities/virtual-exhibition'
import { TMuseum } from '../entities/museum'

const museumTypes: TMuseum[] = [
    'História', 'Militar', 'Arte', 'Arqueologia', 
    'Ciências e Tecnologia', 'Musica', 'Bibliografia', 'Geral'
]

const PointOfInterestSchema = new Schema({
    title: { type: String, required: true },
    coordinates: {
        x: { type: Number, required: true },
        y: { type: Number, required: true }
    },
    // Este ID se refere ao _id de uma das seções no array 'sections'
    linkedSectionId: { type: Schema.Types.ObjectId, required: true }
}, { _id: true })

const MapDataSchema = new Schema({
    imageUrl: { type: String, required: true },
    pointsOfInterest: { type: [PointOfInterestSchema], default: [] }
}, { _id: false })

const MediaSchema = new Schema({
    image: { type: String },
    videoUrl: { type: String },
    audioGuideUrl: { type: String }
}, { _id: false })

const InteractiveElementSchema = new Schema({
    type: { type: String, required: true, enum: ["comparison", "timeline", "3d-model"] },
    data: { type: Schema.Types.Mixed } 
}, { _id: true })

const SectionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    items: [{ type: String, ref: 'Item' }],
    media: { type: MediaSchema },
    interactiveElements: { type: [InteractiveElementSchema], default: [] }
}, { _id: true })

const ExternalLinkSchema = new Schema({
    label: { type: String, required: true },
    url: { type: String, required: true }
}, { _id: false })



const VirtualExhibitionSchema = new Schema<VirtualExhibition>({
    exhibitionId: { type: String, required: true, unique: true, index: true },
    museumId: { type: String, required: true, index: true },
    title: { type: String, required: true, index: true },
    subtitle: { type: String },
    description: { type: String, required: true },
    museumType: { type: String, required: true, enum: museumTypes },
    
    sections: { type: [SectionSchema], default: [] },

    navigationMode: { type: String, required: true, enum: ["free", "map"] },
    mapData: { type: MapDataSchema },

    coverImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
    themeColor: { type: String },
    backgroundMusicUrl: { type: String },
    enable360View: { type: Boolean, default: false },

    allowComments: { type: Boolean, default: true },
    shareable: { type: Boolean, default: true },
    externalLinks: { type: [ExternalLinkSchema], default: [] },
    
    captionsEnabled: { type: Boolean, default: true },
    highContrastModeAvailable: { type: Boolean, default: false },

    isTemporary: { type: Boolean, default: false, index: true },
    startDate: { type: Date },
    endDate: { type: Date, index: true },
    tags: { type: [String], index: true },

}, {
    timestamps: true 
})

VirtualExhibitionSchema.index({
    title: 'text',
    subtitle: 'text',
    description: 'text',
    tags: 'text'
})

export const VirtualExhibitionModel = mongoose.model<VirtualExhibition>(
    'virtualexhibition', 
    VirtualExhibitionSchema
)