import app from './app.js'
import connectDatabase from './config/database.js';
import { SuccessMsg } from './utils/customLog.js';


connectDatabase()
const port = process.env.PORT
app.listen(port,()=>{
    SuccessMsg(`Server is started ${port}`)
})