import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()

const connectToDb = async () => {
    try {

        // await mongoose.connect('mongodb://localhost:27017/console')        
        await mongoose.connect(process.env.MONGODB_URL as string)        
            .then(() => {
                console.log('Connected to MongoDB');
            })
    } catch (err) {
        console.log('Error in MongoDB ', err);
        process.exit(1)
    }
}


export default connectToDb