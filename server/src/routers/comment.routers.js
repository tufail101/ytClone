import express from "express"
import { getVideoComment, publishCommentOnComment, publishCommentOnVideo } from "../controllers/comment.controllers.js"
import { varifyjwt } from "../middlewares/auth.middlewares.js"


const router = express.Router()

router.use(varifyjwt)

router.route("/postVideoCommnet/:videoId").post(publishCommentOnVideo)
router.route("/getVideoComment/:videoId").get(getVideoComment)
router.route("/publishCommentOnComment/:commentId").post(publishCommentOnComment)

export default router