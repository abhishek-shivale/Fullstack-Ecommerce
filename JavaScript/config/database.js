import mongoose from 'mongoose'
import { SuccessMsg, ErrorMsg } from '../utils/customLog.js';
const MONGO_URI = process.env.MONGO_URI;

const connectDatabase = () =>{
    mongoose.connect(MONGO_URI)
    .then(() => {
        SuccessMsg('Database is connected');
      }).catch((error) => {
        ErrorMsg('Database connection error:', error);
      });
}
export default connectDatabase