import { validateFieldEmail, validateFieldPassword, validateFieldPasswordNotNull, validateFieldUserName } from "./defaultsFields";


export const validateLoginUserFields = [
    ...validateFieldEmail,
    ...validateFieldPasswordNotNull
];
export const validateRegisterUserFields = [
    ...validateFieldEmail,
    ...validateFieldPassword,
    ...validateFieldUserName
];