import { body } from "express-validator";
import { accessibilityFeatureTypes, dayTypes, museumTypes, ticketTypes } from "./helper/museumArrays";
import { validateFieldEmail, validateFieldPassword } from "./defaultsFields";

export const validateRegisterMuseumFields = [
    body("cnpj")
        .notEmpty().withMessage('O cnpj não pode estar vazio') // Apenas a string de erro
        .trim()
        .isTaxID('pt-BR').withMessage('Insira um cnpj válido'), // Apenas a string de erro
    ...validateFieldEmail,
    ...validateFieldPassword
];

export const validateCompleteRegisterMuseumFields = [
    body('name')
        .optional()
        .trim()
        .isString().withMessage('O nome deve ser um texto.')
        .isLength({ min: 3, max: 150 }).withMessage('O nome deve ter entre 3 e 150 caracteres.'),

    body('descriptionShort')
        .optional()
        .trim()
        .isLength({ max: 300 }).withMessage('A descrição curta deve ter no máximo 300 caracteres.'),

    body('descriptionLong')
        .optional()
        .trim()
        .isLength({ max: 5000 }).withMessage('A descrição longa deve ter no máximo 5000 caracteres.'),
    
    body('type')
        .optional()
        .isIn(museumTypes).withMessage(`O tipo de museu é inválido. Valores aceitos: ${museumTypes.join(', ')}`),

    // Mensagem dinâmica que usa o 'path' do campo
    body(['logoImageUrl', 'coverImageUrl', 'museumSite'])
        .optional()
        .trim()
        .isURL().withMessage((value, { path }) => `O campo ${path} deve ser uma URL válida.`),

    // --- 2. Localização e Contato ---
    body('address.state')
        .optional()
        .notEmpty().withMessage('O estado (state) não pode estar vazio.')
        .isString().withMessage('O estado (state) deve ser um texto.'),

    body('address.city.name')
        .optional()
        .notEmpty().withMessage('O nome da cidade não pode estar vazio.')
        .isString().withMessage('O nome da cidade deve ser um texto.'),

    body('address.city.code')
        .optional()
        .notEmpty().withMessage('O código da cidade não pode estar vazio.')
        .isString().withMessage('O código da cidade deve ser um texto.'),
        
    body('address.street')
        .optional()
        .notEmpty().withMessage('A rua (street) não pode estar vazia.')
        .isString().withMessage('A rua (street) deve ser um texto.'),

    body('address.number')
        .optional()
        .notEmpty().withMessage('O número do endereço não pode estar vazio.')
        .isString().withMessage('O número do endereço deve ser um texto.'),

    body('address.district')
        .optional()
        .notEmpty().withMessage('O bairro (district) não pode estar vazio.')
        .isString().withMessage('O bairro (district) deve ser um texto.'),

    body('address.postalCode')
        .optional()
        .matches(/^[0-9]{5}-[0-9]{3}$/).withMessage('O CEP deve estar no formato XXXXX-XXX.'),

    body('address.phone')
        .optional()
        .matches(/^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/).withMessage('O formato do telefone é inválido.'),

    // --- 3. Operação e Visitação ---
    body('isOpenToPublic')
        .optional()
        .isBoolean().withMessage('O campo isOpenToPublic deve ser um valor booleano (true ou false).'),

    body('operatingHours')
        .optional()
        .isArray().withMessage('O campo operatingHours deve ser uma lista (array).'),
    body('operatingHours.*.dayOfWeek')
        .optional()
        .isIn(dayTypes).withMessage(`O dia da semana em operatingHours é inválido. Valores aceitos: ${dayTypes.join(', ')}`),
    body('operatingHours.*.openTime')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('O horário de abertura (openTime) deve estar no formato HH:MM.'),
    body('operatingHours.*.closeTime')
        .optional()
        .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('O horário de fechamento (closeTime) deve estar no formato HH:MM.'),

    body('ticketsPrices')
        .optional()
        .isArray().withMessage('O campo ticketsPrices deve ser uma lista (array).'),
    body('ticketsPrices.*.type')
        .optional()
        .isIn(ticketTypes).withMessage(`O tipo de ingresso é inválido. Valores aceitos: ${ticketTypes.join(', ')}`),
    body('ticketsPrices.*.priceInCents')
        .optional()
        .isInt({ min: 0 }).withMessage('O preço em centavos (priceInCents) deve ser um número inteiro não negativo.'),

    // --- 4. Acervo e Acessibilidade ---
    body('gallery')
        .optional()
        .isArray().withMessage('O campo gallery deve ser uma lista (array).'),
    body('gallery.*.imgUrl')
        .optional()
        .isURL().withMessage('A URL da imagem na galeria é inválida.'),
    body('gallery.*.title')
        .optional()
        .notEmpty().withMessage('O título na galeria não pode estar vazio.')
        .isString().withMessage('O título na galeria deve ser um texto.'),

    body('accessibilityFeatures')
        .optional()
        .isArray().withMessage('O campo accessibilityFeatures deve ser uma lista (array).'),
    body('accessibilityFeatures.*')
        .optional()
        .isIn(accessibilityFeatureTypes).withMessage(`O recurso de acessibilidade é inválido. Valores aceitos: ${accessibilityFeatureTypes.join(', ')}`),

    body('history')
        .optional()
        .trim()
        .isString().withMessage('O campo de história deve ser um texto.')
        .isLength({ max: 10000 }).withMessage('A história do museu deve ter no máximo 10000 caracteres.'),

    body('specialNotesHours')
        .optional()
        .trim()
        .isString().withMessage('As notas especiais devem ser um texto.')
        .isLength({ max: 500 }).withMessage('As notas especiais sobre horários devem ter no máximo 500 caracteres.'),

    body('affiliated')
        .optional()
        .isArray({ min: 1 }).withMessage('O campo de afiliados deve ser uma lista.'),
    body('affiliated.*')
        .notEmpty().withMessage('Cada ID de afiliado não pode estar vazio.')
        .isString().withMessage('Cada afiliado deve ser um ID em formato de texto.'),

    body('externalLinks')
        .optional()
        .isArray().withMessage('O campo de links externos deve ser uma lista.'),
    body('externalLinks.*.name')
        .notEmpty().withMessage('O nome do link externo não pode estar vazio.')
        .isString().withMessage('O nome do link externo deve ser um texto.'),
    body('externalLinks.*.url')
        .notEmpty().withMessage('A URL do link externo não pode estar vazia.')
        .isURL().withMessage('A URL do link externo é inválida.'),
    body('externalLinks.*.iconUrl')
        .notEmpty().withMessage('A URL do ícone não pode estar vazia.')
        .isURL().withMessage('A URL do ícone é inválida.')
];