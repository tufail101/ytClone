import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from "./routers/user.routers.js"
import videoRouter from "./routers/video.routers.js"
import subscriptionRouter from "./routers/subscription.routers.js"
import likeRouter from "./routers/like.routers.js"
import commentRouter from "./routers/comment.routers.js"
import playListRouter from "./routers/playList.routers.js"

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use("/api/v1/user",userRouter)
app.use("/api/v1/video",videoRouter)
app.use("/api/v1/subscription",subscriptionRouter)
app.use("/api/v1/like",likeRouter)
app.use("/api/v1/comment",commentRouter)
app.use("/api/v1/playList",playListRouter)

export {app}