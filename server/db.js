import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ethernet_petition';

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 6000 });
    console.log(`Connected to MongoDB database "${mongoose.connection.name}".`);
    return mongoose.connection;
  } catch (err) {
    console.error('\nCould not connect to MongoDB at', MONGODB_URI);
    console.error('Start MongoDB with:  net start MongoDB   (runs as a Windows service)');
    console.error('Or set MONGODB_URI to a free MongoDB Atlas cluster in your .env file.');
    console.error(err.message);
    process.exit(1);
  }
}