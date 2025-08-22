import { TOtpAction, TTempTokenAction } from "../../../interfaces/otp";

export interface IRedisCacheServiceContract {
    verifyOTP: (action: TOtpAction, id: string, otp: string)=>Promise<string>
    createOTP: (action: TOtpAction, id: string, otpValue?: string)=>Promise<string | { otp: string, value:string }>
    createTempToken:(action: TTempTokenAction, id:string)=>Promise<string>
    verifyTempToken:(action: TTempTokenAction, id:string)=>Promise<string>
}   