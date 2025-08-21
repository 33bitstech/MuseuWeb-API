import { EntityItem } from "./item";
import { TMuseum } from "./museum";

export type TVirtualTourType = "slide" | "reference_point" | "timeline";

export interface EntityVirtualTour {
    // Identificação
    tourId: string;
    museumId: string
    title: string;
    description: string;
    museumType: TMuseum;
    tourType: TVirtualTourType;
    slug?: string; // URL amigável

    // Conteúdo e narrativa
    curatorName?: string;
    curatorId?: string;
    narrativeScript?: string;
    historicalContext?: string;
    relatedTours?: string[]; // IDs ou slugs de outros tours

    // Lista de itens
    items: {
        item: string;
        position: number;
        spotlightText?: string;

        // Campos específicos por tipo
        referencePoint?: {
            x: number;
            y: number;
            mapImageUrl?: string;
        };
        timelineData?: {
            year: number;
            month?: number;
            day?: number;
            periodLabel?: string;
        };
    }[];

    // Mídias e recursos avançados
    coverImage: string;
    introVideoUrl?: string;
    backgroundMusicUrl?: string;
    audioNarrationUrl?: string;
    imageGalleries?: string[];
    interactiveElements?: {
        type: "model3D" | "panorama" | "quiz" | "ar";
        url: string;
        description?: string;
    }[];
    enable360View?: boolean;

    // Experiência do visitante
    estimatedDuration?: number; // minutos
    difficultyLevel?: "easy" | "medium" | "hard";
    minAge?: number;
    maxAge?: number;
    visitorCount?: number;
    ratingAverage?: number;

    // Recursos interativos
    checkpoints?: number[]; // posições no tour
    quizzes?: string[]; // IDs de quizzes
    feedbackFormUrl?: string;

    // SEO e compartilhamento
    socialShareImage?: string;
    keywords?: string[];
    metaDescription?: string;

    // Gestão e controle interno
    isPublished?: boolean;
    publishDate?: Date;
    lastEditedBy?: string;
    version?: number;
    notes?: string;

    // Metadados
    tags?: string[];
    createdAt: Date;
    updatedAt?: Date;
}
