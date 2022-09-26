import mongoose from 'mongoose';
import { MONGO_URI } from './index';

const connectDB = async () => {
    const conn = await mongoose.connect(MONGO_URI)
     console.log(
       `MongoDB Connected: ${conn.connection.host}`
     );
};

export default connectDB;
