import mongoose from "mongoose";


const connectToDb = async () => {
    try {

        await mongoose.connect('mongodb://localhost:27017/console')        
            .then(() => {
                console.log('Connected to MongoDB');
            })
    } catch (err) {
        console.log('Error in MongoDB ', err);
        process.exit(1)
    }
}


export default connectToDb