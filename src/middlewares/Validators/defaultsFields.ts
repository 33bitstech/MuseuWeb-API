import { body } from "express-validator"


export const validateFieldEmail = [
    body("email")
        .notEmpty().withMessage('O email não pode estar vazio')
        .trim()
        .isEmail().withMessage('Insira um email válido'),
]
export const validateFieldPassword = [
    body('password')
        .isLength({ min: 6 }).withMessage('Senha muito curta, o minimo são 6 caracteres')
]
export const validateFieldPasswordNotNull = [
    body('password')
        .notEmpty().withMessage('Senha está vazia')
]
export const validateFieldUserName = [
    body('name')
        .isLength({ min: 3, max: 50}).withMessage('O nome deve ter entre 3 a 50 caracteres')
]
export const validateFieldMuseumId = [
    body('museumId')
        .notEmpty().withMessage('É necessario o envio do id do museu que o curator vai logar')
]
