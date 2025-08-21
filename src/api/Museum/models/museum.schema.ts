import mongoose, { Schema } from 'mongoose'
import { EntityMuseum } from '../entities/museum'

const GalleryItemSchema = new Schema({
    imgUrl: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String }
}, { _id: true })

const ExternalLinkSchema = new Schema({
    iconUrl: { type: String, required: true },
    name: { type: String, required: true },
    url: { type: String, required: true }
}, { _id: true })

const TicketPriceSchema = new Schema({
    type: {
        type: String,
        enum: ['INTEIRA', 'MEIA', 'ISENTO', 'GRUPO', 'OUTRO'],
        required: true
    },
    priceInCents: { type: Number, required: true },
    description: { type: String }
})

const OperatingHoursSchema = new Schema({
    dayOfWeek: {
        type: String,
        enum: [
            'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 
            'SEXTA', 'SABADO', 'DOMINGO'
        ],
        required: true
    },
    isClosed: { type: Boolean, default: false },
    openTime: { type: String },
    closeTime: { type: String }
})

const RatingSchema = new Schema({
    oneStar: { type: [String], default: [] },
    twoStars: { type: [String], default: [] },
    threeStars: { type: [String], default: [] },
    fourStars: { type: [String], default: [] },
    fiveStars: { type: [String], default: [] },
    totalRating: { type: Number, required: true, default: 0 }
})

// Validação de CNPJ
const cnpjRegex = /^(\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{14})$/

const EntityMuseumSchema = new Schema<EntityMuseum>({
    // --- Campos Obrigatórios ---
    museumId: { type: String, required: true, unique: true, index: true },
    cnpj: {
        type: String,
        required: true,
        unique: true,
        index: true,
        validate: {
            validator: (value: string) => cnpjRegex.test(value),
            message: 'CNPJ inválido. Use 14 dígitos ou no formato 00.000.000/0000-00'
        }
    },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, index:true },
    isActive: { type: Boolean, required: true, default: false },
    verifiedEmail: { type: Boolean, required: true, default: false },

    // --- Campos Opcionais ---
    name: { type: String },
    descriptionShort: { type: String },
    descriptionLong: { type: String },
    address: {
        state: { type: String },
        city: {
            name: { type: String },
            code: { type: String }
        },
        street: { type: String },
        number: { type: String },
        district: { type: String },
        postalCode: { type: String },
        phone: { type: String }
    },
    affiliated: [{ type: String }],
    history: { type: String },
    gallery: { type: [GalleryItemSchema], default: [] },
    logoImageUrl: { type: String },
    coverImageUrl: { type: String },
    externalLinks: { type: [ExternalLinkSchema], default: [] },
    museumSite: { type: String },
    type: {
        type: String,
        enum: [
            'História', 'Militar', 'Arte', 'Arqueologia',
            'Ciências e Tecnologia', 'Musica', 'Bibliografia', 'Geral'
        ]
    },
    isOpenToPublic: { type: Boolean },
    ticketsPrices: { type: [TicketPriceSchema], default: [] },
    operatingHours: { type: [OperatingHoursSchema], default: [] },
    specialNotesHours: { type: String },
    accessibilityFeatures: {
        type: [String],
        enum: [
            'RAMPA DE ACESSO', 'ELEVADOR', 'BANHEIRO ADAPTADO',
            'AUDIOGUIA', 'INTERPRETE LIBRAS', 'PISO TATIL'
        ],
        default: []
    },
    subscription: {
        type: String,
        enum: ['Basico', 'Instituição', 'Patrimônio']
    },
    subscriptionPeriodEnd: { type: Number },
    rating: { type: RatingSchema },

    stripeInfos: {
        museumCustomerId: { type: String, default: undefined, index: true},
        invoiceId: { type: String, default: undefined, index: true},
    }
})

// Índices (sem alterações)
EntityMuseumSchema.index({name: 1})
EntityMuseumSchema.index({ "address.state": 1, "address.city.name": 1 })
EntityMuseumSchema.index({ type: 1 })
EntityMuseumSchema.index({ accessibilityFeatures: 1 })

export const MuseumModel = mongoose.model<EntityMuseum>(
    'museum',
    EntityMuseumSchema
)