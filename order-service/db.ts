import mongoose, { MongooseError } from 'mongoose';
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI_ORDER as string);
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
