export type TDay = 
    | 'SEGUNDA' 
    | 'TERCA' 
    | 'QUARTA' 
    | 'QUINTA' 
    | 'SEXTA' 
    | 'SABADO' 
    | 'DOMINGO';

export type TMuseum = 
    | 'História'
    | 'Militar'
    | 'Arte'
    | 'Arqueologia'
    | 'Ciências e Tecnologia'
    | 'Musica'
    | 'Bibliografia'
    | 'Geral';

export type TAccessibilityFeature = 
    | 'RAMPA DE ACESSO' 
    | 'ELEVADOR'
    | 'BANHEIRO ADAPTADO'
    | 'AUDIOGUIA'
    | 'INTERPRETE LIBRAS'
    | 'PISO TATIL';
    
export type TTicketType = 
    | 'INTEIRA' 
    | 'MEIA' 
    | 'ISENTO' 
    | 'GRUPO' 
    | 'OUTRO';

export type TSubscription =
    | 'Basico'
    | 'Instituição'
    | 'Patrimônio'
    | undefined

export interface IGalleryItem {
    imgUrl: string;
    title: string;
    description?: string;
}

export interface IExternalLink {
    iconUrl: string;
    name: string;
    url: string;
}

export interface ITicketPrice {
    type: TTicketType;
    priceInCents: number;
    description?: string; 
}

export interface IOperatingHours {
    dayOfWeek: TDay;
    isClosed?: boolean;
    openTime?: string;  // "09:00"
    closeTime?: string; // "17:00"
}

export interface IRating {
    oneStar: Array<string>;
    twoStars: Array<string>;
    threeStars: Array<string>;
    fourStars: Array<string>;
    fiveStars: Array<string>;
    totalRating: number;
}

export interface EntityMuseum {
    // Campos obrigatórios
    museumId: string;
    cnpj: string;
    password: string;
    email: string;
    isActive: boolean;
    verifiedEmail: boolean

    // Campos opcionais
    name?: string;
    descriptionShort?: string;
    descriptionLong?: string;
    address?: {
        state: string;
        city: { name: string, code: string };
        street: string;
        number: string;
        district: string;
        postalCode: string;
        phone: string;
    };
    affiliated?: string[]; // id das filiais
    history?: string;
    gallery?: IGalleryItem[]; 
    logoImageUrl?: string;
    coverImageUrl?: string;
    externalLinks?: IExternalLink[];
    museumSite?: string
    type?: TMuseum;
    isOpenToPublic?: boolean;
    ticketsPrices?: ITicketPrice[];
    operatingHours?: IOperatingHours[];
    specialNotesHours?: string; 
    accessibilityFeatures?: TAccessibilityFeature[];
    subscription?: TSubscription;
    subscriptionPeriodEnd?: number
    rating?: IRating;

    stripeInfos:{
        museumCustomerId?: string,
        invoiceId?: string
    }
}