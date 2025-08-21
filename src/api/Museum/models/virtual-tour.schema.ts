import mongoose, { Schema } from 'mongoose'
import { EntityVirtualTour, TVirtualTourType } from '../entities/virtual-tour'
import { TMuseum } from '../entities/museum' 

const museumTypes: TMuseum[] = [
    'História', 'Militar', 'Arte', 'Arqueologia', 
    'Ciências e Tecnologia', 'Musica', 'Bibliografia', 'Geral'
]
const tourTypes: TVirtualTourType[] = ['slide', 'reference_point', 'timeline']

const ReferencePointSchema = new Schema({
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    mapImageUrl: { type: String }
}, { _id: false })

const TimelineDataSchema = new Schema({
    year: { type: Number, required: true },
    month: { type: Number },
    day: { type: Number },
    periodLabel: { type: String }
}, { _id: false })

const InteractiveElementSchema = new Schema({
    type: { type: String, required: true, enum: ["model3D", "panorama", "quiz", "ar"] },
    url: { type: String, required: true },
    description: { type: String }
}, { _id: true }) 

const TourItemSchema = new Schema({
    item: { type: String, ref: 'Item', required: true },
    
    position: { type: Number, required: true },
    spotlightText: { type: String },
    referencePoint: { type: ReferencePointSchema },
    timelineData: { type: TimelineDataSchema }
}, { _id: true })


const VirtualTourSchema = new Schema<EntityVirtualTour>({
    tourId: { type: String, required: true, unique: true, index: true },
    museumId: { type: String, required: true, index: true },
    title: { type: String, required: true, index: true },
    description: { type: String, required: true },
    museumType: { type: String, required: true, enum: museumTypes },
    tourType: { type: String, required: true, enum: tourTypes },
    slug: { type: String, unique: true, sparse: true },

    curatorName: { type: String },
    curatorId: { type: String },
    narrativeScript: { type: String },
    historicalContext: { type: String },
    relatedTours: { type: [String], default: [] },
    
    items: { type: [TourItemSchema], default: [] },

    coverImage: { type: String, required: true },
    introVideoUrl: { type: String },
    backgroundMusicUrl: { type: String },
    audioNarrationUrl: { type: String },
    imageGalleries: { type: [String], default: [] },
    interactiveElements: { type: [InteractiveElementSchema], default: [] },
    enable360View: { type: Boolean, default: false },

    estimatedDuration: { type: Number },
    difficultyLevel: { type: String, enum: ["easy", "medium", "hard"] },
    minAge: { type: Number },
    maxAge: { type: Number },
    visitorCount: { type: Number, default: 0 },
    ratingAverage: { type: Number, default: 0 },

    checkpoints: { type: [Number], default: [] },
    quizzes: { type: [String], default: [] },
    feedbackFormUrl: { type: String },

    socialShareImage: { type: String },
    keywords: { type: [String], default: [] },
    metaDescription: { type: String },

    isPublished: { type: Boolean, default: false, index: true },
    publishDate: { type: Date },
    lastEditedBy: { type: String },
    version: { type: Number, default: 1 },
    notes: { type: String },

    tags: { type: [String], index: true },
    
}, {
    timestamps: true 
})

VirtualTourSchema.index({ museumId: 1, isPublished: 1 })
VirtualTourSchema.index({
    title: 'text',
    description: 'text',
    tags: 'text',
    keywords: 'text',
    curatorName: 'text'
})

export const VirtualTourModel = mongoose.model<EntityVirtualTour>(
    'virtualtour', 
    VirtualTourSchema
)