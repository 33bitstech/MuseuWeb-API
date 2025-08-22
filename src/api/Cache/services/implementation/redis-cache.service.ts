import { ErrorsGlobal } from "../../../../errors/errors-global"
import { TOtpAction, TTempTokenAction } from "../../../../interfaces/otp"
import generateOTP, { generateTempToken } from "../../../../utils/generateOtp"
import HttpStatus from "../../../../utils/httpStatus"
import { IRedisCacheServiceContract } from "../IRedis-cache.service"
import { CacheService } from "./cache.service"

export class RedisCacheService implements IRedisCacheServiceContract {
    constructor(
        private readonly cacheService: CacheService
    ){}

    public verifyOTP = async (action: TOtpAction, id: string, otp: string)=>{
        const otpKey = `otp:${action}:${id}`
        const storedOtp = await this.cacheService.get(otpKey)

        if ( !storedOtp ) throw new ErrorsGlobal('Codigo inválido', HttpStatus.BAD_REQUEST.code)

        if ( storedOtp === otp ) return await this.cacheService.delete(otpKey)

        const otpObject = await JSON.parse(storedOtp)
        if ( otpObject.otp == otp ) {
            await this.cacheService.delete(otpKey)
            return otpObject.value
        }

        throw new ErrorsGlobal('Codigo inválido', HttpStatus.BAD_REQUEST.code)
    }
    public createOTP = async (action: TOtpAction, id: string, otpValue?: string)=>{
        const generatedOtp = generateOTP()

        const otp = otpValue 
            ? {
                otp:generatedOtp, 
                value: otpValue
            }
            : generatedOtp

        const otpKey = `otp:${action}:${id}`
        const otpExp = 1200 // 20 minutos
        const saveOtp = otpValue ? JSON.stringify(otp) : otp as string
        await this.cacheService.set(otpKey, saveOtp, otpExp)
        return otp
    }
    public createTempToken = async(action: TTempTokenAction, id:string)=>{
        const token = generateTempToken()
        const key = `token:${action}:${token}`
        const expirationInSeconds = 3600 // 1hora

        await this.cacheService.set(key, id, expirationInSeconds)

        return token
    }
    public verifyTempToken = async(action: TTempTokenAction, token:string)=>{
        const key = `token:${action}:${token}`
        const storedId = await this.cacheService.get(key)

        if ( !storedId ) throw new ErrorsGlobal('Token inválido', HttpStatus.BAD_REQUEST.code)

        await this.cacheService.delete(key)

        return storedId
    }
}