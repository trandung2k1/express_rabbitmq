import mongoose, { MongooseError } from 'mongoose';
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/products');
        console.log('MongoDB connected...');
    } catch (error) {
        if (error instanceof MongooseError) {
            console.log(error.message);
        }
        console.log('MongoDB connected error');
        process.exit(1);
    }
};

export default connectDB;
