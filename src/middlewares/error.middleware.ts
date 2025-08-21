import { NextFunction, Request, Response } from "express"
import { ErrorsGlobal } from "../errors/errors-global"
import { ValidationError, validationResult } from "express-validator"
import HttpStatus from "../utils/httpStatus"

type FieldValidationError = ValidationError & {
    path?: string     
    location?: string 
    value?: any       
}

export const ErrorMiddlewareGlobal = (error: unknown, req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) return next(error)

    console.log(error)

    if (Array.isArray(error) && error.every(e => e instanceof ErrorsGlobal)) {
        return res.status(error[0].status_code).json({ errors: error })
    }

    if (error instanceof ErrorsGlobal) {
        return res.status(error.status_code).json({
            error: {
                message: error.message,
                description: error.description
            }
        })
    }

    res.status(500).json({
        error: {
            message: 'An error occurred on the server',
            description: 'view the logs for more details'
        }
    })
}

export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req)

    if (errors.isEmpty()) {
        return next()
    }

    const formattedErrors = errors.array().map((error) => {
        const err = error as FieldValidationError

        if (err.msg instanceof ErrorsGlobal) return err.msg

        return new ErrorsGlobal(
            err.path || "unknown",
            HttpStatus.BAD_REQUEST.code,
            typeof err.msg === "string" ? err.msg : "Erro de validação."
        )
    })

    return next(formattedErrors)
}
