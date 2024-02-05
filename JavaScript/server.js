import app from './app.js'
import cloudinary from 'cloudinary'
import connectDatabase from './config/database.js';
import { SuccessMsg, ErrorMsg } from './utils/customLog.js';

process.on('uncaughtException', (err) => {
    ErrorMsg(`Error: ${err}`);
    process.exit(1);
});

connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT

const server = app.listen(port,()=>{
    SuccessMsg(`Server is started ${port}`)
})

process.on('unhandledRejection', (err) => {
    ErrorMsg(`Error: ${err}`);
    server.close(() => {
        process.exit(1);
    });
});