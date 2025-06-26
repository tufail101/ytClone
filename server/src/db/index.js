import mongoose from "mongoose"
import { DB_NAME } from "../constaint.js";

const connectDB =async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${DB_NAME}`)
        console.log("MongoDb connect succesfully");
        
    } catch (error) {
        console.log(error);
        console.log("failed to connect DB");
        
        process.exit(1)
        
    }
}

export {connectDB}