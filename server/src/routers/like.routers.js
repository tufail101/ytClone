import express from "express"
import {varifyjwt} from "../middlewares/auth.middlewares.js"
import { getAllLIkedVideo, toggleCommentLike, toggleVideoLike } from "../controllers/like.controllers.js"

const router = express.Router()

router.use(varifyjwt)

router.route("/likeVideo/:videoId").post(toggleVideoLike)
router.route("/likeComment/:commentId").post(toggleCommentLike)
router.route("/getLikedVideo").get(getAllLIkedVideo)

export default router