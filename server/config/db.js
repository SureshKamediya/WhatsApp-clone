import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const connectionURL = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.sehrz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const connectDB = async () => {
    try {
      await mongoose.connect(
        connectionURL,
        {
            useNewUrlParser:  true,
            useCreateIndex: true,
            useUnifiedTopology: true
        }
      );
    } catch (err) {
      console.error(err.message);
      process.exit(1);
    }
};

export default connectDB;