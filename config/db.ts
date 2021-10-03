import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const db = process.env.MONGO_URI

const dbConnector = async () => {
    try {
        if (!db) throw Error('No database url found');
        await mongoose.connect(db, {}, () => console.log('MongoDB Connected!'));
    } catch (err) {
        console.error(err)
    }
}

export default dbConnector;