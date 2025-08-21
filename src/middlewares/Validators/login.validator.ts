import { body } from "express-validator";
import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import validator from 'validator';

export const validateLoginMuseumFields = [
    body("identifier")
        .notEmpty().withMessage('O Identificador não pode estar vazio')
        .custom((value) => {
            if (validator.isEmail(value) || cnpjValidator.isValid(value)) return true

            throw new Error('O Identificador precisa ser um e-mail ou um CNPJ válido');
        }),

    body('password')
        .isLength({ min: 6 }).withMessage('Senha muito curta, o mínimo são 6 caracteres')
];