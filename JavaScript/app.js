import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config()
import userRoute from './routes/userRoute.js'

const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())

app.use('/',userRoute)

export default app