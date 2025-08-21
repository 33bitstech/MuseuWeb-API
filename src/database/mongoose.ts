import mongoose from "mongoose";

export const mongoDBConnection = async () : Promise<void> =>{
    try {
        await mongoose.connect('mongodb://localhost:27017/museuweb')
        console.log('connected to database')
    } catch (err) {
        console.error('erro ao conectar ao mongodb', err)
        process.exit(1)
    }
}