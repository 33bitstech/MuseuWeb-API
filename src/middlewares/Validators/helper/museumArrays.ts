import { TAccessibilityFeature, TDay, TMuseum, TTicketType } from "../../../api/Museum/entities/museum";

export const museumTypes: TMuseum[] = ['História', 'Militar', 'Arte', 'Arqueologia', 'Ciências e Tecnologia', 'Musica', 'Bibliografia', 'Geral'];
export const dayTypes: TDay[] = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'];
export const accessibilityFeatureTypes: TAccessibilityFeature[] = ['RAMPA DE ACESSO', 'ELEVADOR', 'BANHEIRO ADAPTADO', 'AUDIOGUIA', 'INTERPRETE LIBRAS', 'PISO TATIL'];
export const ticketTypes: TTicketType[] = ['INTEIRA', 'MEIA', 'ISENTO', 'GRUPO', 'OUTRO'];