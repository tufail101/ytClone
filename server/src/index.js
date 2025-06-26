import dotenv from "dotenv"
dotenv.config()


import { connectDB } from "./db/index.js"
import { app } from "./app.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`⚙️ Server connected`);
        
    })
})
.catch((err)=>{
    console.log(err);
    console.log("falied to connect server and DB");
    
})

