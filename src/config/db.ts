import mongoose from "mongoose";
import { config } from "./config";

export default async function connectDB(){
    console.log('MongoDB connection with retry');
    try{
        await mongoose.connect(config.DATABASE_URI,{})
        console.log('connected to MongoDB')
    }catch(error){
        console.error('error occurred during connection to mongodb',error)
        setTimeout(() =>{
            connectDB()
        },5000)
    }
} 