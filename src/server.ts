import { loadEnv } from "./config/environments";
loadEnv()

import express from "express";
import helmet from "helmet";
import compression from 'compression'
import cors from 'cors'
import rateLimit from 'express-rate-limit'

import { ErrorMiddlewareGlobal } from "./middlewares/error.middleware";
import { authRoutes } from "./api/Auth/routes/auth-route";
import { mongoDBConnection } from "./database/mongoose";

import stripeConfig from "stripe";
import { paymentRoutes, stripeWebhook } from "./api/Payments/routes/payment.route";
import passport from "./config/passport.config";


export const stripe = new stripeConfig(process.env.STRIPE_SECRET_KEY as string)

const app = express()
const PORT = process.env.PORT

mongoDBConnection()

app.post('/stripe/webhook', express.raw({type: 'application/json'}), stripeWebhook)

app.use(cors({
    origin: process.env.CORS_ORIGIN
}));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 100,
});
app.use(limiter)
app.use(helmet())
app.use(express.json())
app.use(compression())

app.use(passport.initialize())

app.use('/payments', paymentRoutes)
app.use('/auth', authRoutes)

app.use(ErrorMiddlewareGlobal)

//GETS GENERAL
//all
/* app.get('/users')
app.get('/museums')
app.get('/curators/:museumId')
app.get('/items/:museumId?')

//unic
app.get('/users/:userId')
app.get('/museums/:museumId')
app.get('/curators/:curatorId')
app.get('/items/:museumId/:itemId')

//CREATE
app.post('/items/:museumId')

//UPDATES
app.put('/users/userId')
app.put('/museums/:museumId')
app.put('/curators/:curatorId')
app.put('/items/:museumId/:itemId')

//DELETES
app.delete('/users/userId')
app.delete('/museums/:museumId')
app.delete('/curators/:curatorId')
app.delete('/items/:museumId/:itemId')



//TOUR
app.get('/tours/:museumId')
app.get('/tours/:museumId/:tourId')
app.post('/tours/:museumId')
app.put('/tours/:museumId/:tourId')
app.delete('/tours/:museumId/:tourId')

//EXHIBITION
app.get('/exhibition/:museumId')
app.get('/exhibition/:museumId/:exhibitionId')
app.post('/exhibition/:museumId')
app.put('/exhibition/:museumId/:exhibitionId')
app.delete('/exhibition/:museumId/:exhibitionId')


//REPORTS
app.post('/report') // o body vai ter oq vai ser e o id da coisa e o corpo do report


//HISTORY
app.get('/history/:museumId')
app.get('/history/:museumId/:curatorId')
app.get('/history/payments/:museumId')


//PAYMENTS
app.get('/subscribe/:museumId')
app.post('/subscribe')
app.put('/subscribe/:museumId')
app.delete('/subscribe/:museumId') //cancelar */


app.listen(PORT, ()=>{
    console.log(`API url: http://localhost:${PORT}`)
})