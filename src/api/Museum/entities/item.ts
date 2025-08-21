import { TMuseum } from "./museum";

export interface EntityItem{
    itemId: string
    museumId: string
    title: string
    descriptionShort: string
    descriptionLong: string

    museumType: TMuseum;
    category: string; // Categoria da peça dentro do acervo
    inventoryNumber: string; // Código único da peça
    collection?: string; // Ex: "Coleção de Arte Grega"
    tags?: string[];

    // Classificação histórica / técnica
    period?: string; // Ex: "Clássico (480-323 a.C.)"
    itemType?: string; // Ex: "Cerâmica", "Manuscrito", "Arma de fogo"
    material?: string; // Ex: "Argila, pigmentos naturais"
    technique?: string; // Ex: "Óleo sobre tela", "Escultura em mármore"

    // Origem e localização
    origin?: {
        country?: string;
        city?: string;
        originalLocation?: string; // Local de descoberta/criação
    };
    actualLocation?: string; // Onde está exposta ou armazenada
    itemCondition?: string; // Ex: "Excelente", "Restaurado"

    // Datas
    creationDate?: {
        year?: number;
        month?: number;
        day?: number;
    };
    acquisitionDate?: Date; // Quando entrou no acervo
    createdAt: Date;
    updatedAt?: Date;

    // Autoria / proveniência
    author?: string; // Criador ou responsável
    provenance?: string; // Histórico de posse até chegar ao museu
    history?: string; // Texto livre com informações adicionais

    // Dimensões físicas
    dimensions?: {
        height?: number;
        width?: number;
        depth?: number;
        weight?: number; // em kg
        unit?: string; // "cm", "m", etc.
        description?: string
    };

    // Imagens e mídias
    images: {
        url: string;
        description?: string;
        credits?: string; // Nome do fotógrafo ou instituição
    }[];

    // Arquivos complementares
    documents?: {
        url: string;
        type: string; // PDF, DOCX, Áudio, Vídeo
        description?: string;
    }[];

    // Campos adicionais de pesquisa
    bibliographicReferences?: string[]; // Lista de fontes
    copyright?: string; // Info sobre copyright/licença

    totalSize?: number
}