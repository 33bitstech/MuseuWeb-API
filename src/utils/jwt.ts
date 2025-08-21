import { sign, verify } from "jsonwebtoken"; 
import { loadEnv } from "../config/environments";
import ms from "ms";

loadEnv()


export const signToken = async function (data: object | string, expiresIn: number | ms.StringValue): Promise<string | void>{
    return new Promise<string | void>((resolve, reject) => {
        sign(data, process.env.JWT_SECRET || '', {expiresIn}, (err, token) => {
            if(err) return reject(err)

            return resolve(token)
        } )
    })
}

export const decodeToken = async function (token:string): Promise<any>{
    
    return new Promise<any>((resolve, reject) => {
        verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
            if(err) return reject(err)

            return resolve(decoded as any)
        } )
    })
}