import { validateFieldMuseumId, validateFieldPassword, validateFieldPasswordNotNull, validateFieldUserName } from "./defaultsFields";

export const validateLoginCurator = [
    ...validateFieldMuseumId,
    ...validateFieldUserName,
    ...validateFieldPasswordNotNull
]
export const validateRegisterCurator = [
    ...validateFieldMuseumId,
    ...validateFieldUserName,
    ...validateFieldPassword
]