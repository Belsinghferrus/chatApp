import mongoose from 'mongoose'


export const connectDB = async()=>{
    try {
       const dbConnect = await mongoose.connect(process.env.MONGODB_URL);
       console.log(`MongoDB Connected ${dbConnect.connection.host}`);
       
    } catch (error) {
        console.error("MongoDB connection error",error);
        
    }
}

