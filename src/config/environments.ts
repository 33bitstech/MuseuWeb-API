import dotenv from 'dotenv'
import path from 'path';

export function loadEnv() {
    const env = process.env.NODE_ENV || 'development'
    const envPath = path.resolve(process.cwd(), `.env.${env}`)

    const result = dotenv.config({path: envPath})

    if(result.error) dotenv.config()
}