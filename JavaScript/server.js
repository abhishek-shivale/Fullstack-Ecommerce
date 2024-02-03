import app from './app.js'
import connectDatabase from './config/database.js';
import { SuccessMsg } from './utils/customLog.js';

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

connectDatabase()
const port = process.env.PORT




app.listen(port,()=>{
    SuccessMsg(`Server is started ${port}`)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});