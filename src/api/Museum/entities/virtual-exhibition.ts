import { TMuseum } from "./museum";

export interface EntityVirtualExhibition {
    exhibitionId?: string;
    museumId: string
    title: string; // Nome da exposição
    subtitle?: string; // Subtítulo opcional
    description: string; // Texto geral sobre a exposição
    museumType: TMuseum;

    // Organização da exposição
    sections: {
        sectionId?: string;
        title: string;
        description?: string;
        items: string[]; // Itens agrupados por tema ou localização
        media?: {
            image?: string; // Imagem de capa da seção
            videoUrl?: string; // Vídeo de introdução
            audioGuideUrl?: string; // Áudio-guia específico da seção
        };
        interactiveElements?: {
            type: "comparison" | "timeline" | "3d-model";
            data: any; // Estrutura específica do tipo
        }[];
    }[];

    // Navegação e interatividade
    navigationMode: "free" | "map"  // Exploração livre, por mapa ou guiada
    mapData?: {
        imageUrl: string; // Imagem do mapa da exposição
        pointsOfInterest: {
            id: string;
            title: string;
            coordinates: { x: number; y: number }; // Coordenadas no mapa
            linkedSectionId: string; // Liga o ponto a uma seção
        }[];
    };

    // Mídias e design
    coverImage: string;
    galleryImages?: string[];
    themeColor?: string; // Personalização visual
    backgroundMusicUrl?: string; // Música ambiente
    enable360View?: boolean;

    // Integração social e engajamento
    allowComments?: boolean;
    shareable?: boolean;
    externalLinks?: { label: string; url: string }[];

    // Acessibilidade
    captionsEnabled?: boolean; // Legendas em vídeos
    highContrastModeAvailable?: boolean;

    // Metadados
    isTemporary?: boolean;
    startDate?: Date;
    endDate?: Date;
    tags?: string[];
    createdAt: Date;
    updatedAt?: Date;
}
