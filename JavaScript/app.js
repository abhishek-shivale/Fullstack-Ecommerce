import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import fileUpload from 'express-fileupload'
import errorMiddleware from './middlewares/error.js'

const app = express()
dotenv.config()

app.use(express.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())
app.use(fileUpload());

import userRoute from './routes/userRoute.js'
import orderRoute from './routes/orderRoute.js'
import paymentRoute from './routes/paymentRoute.js'
import productRoute from './routes/productRoute.js'

app.use('/api/v1', userRoute);
app.use('/api/v1', productRoute);
app.use('/api/v1', orderRoute);
app.use('/api/v1', paymentRoute);



app.use(errorMiddleware)
export default app