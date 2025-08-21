import { randomBytes, randomInt } from 'crypto'
export default function generateOTP() {
    return randomInt(100000, 999999).toString();
}
export function generateTempToken(){
    return randomBytes(32).toString('hex')
}