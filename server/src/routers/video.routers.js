import express from "express"
import { deleteVideo, getAllVideos, getVideoById, getVideoBySearch, publishVideo, toggleVideoPublish, updateVideo } from "../controllers/video.controllers.js"
import { varifyjwt } from "../middlewares/auth.middlewares.js"
import { upload } from "../middlewares/multer.middlewares.js"

const router = express.Router()

router.use(varifyjwt)

router.route("/getAllVideo").get(getAllVideos)
router.route("/getVideoBySearch").get(getVideoBySearch)
router.route("/publishVideo").post(
    varifyjwt,
    upload.fields([
        {
            name : "thumbnail",
            maxCount : 1
        },
        {
            name : "video",
            maxCount : 1
        }
    ]),
    publishVideo
)
router.route("/updateVideo/:videoId").post(
    upload.single("thumbnail"),
    updateVideo
)
router.route("/deleteVideo/:videoId").post(deleteVideo)
router.route("/toggleVideoPublish/:videoId").post(toggleVideoPublish)
router.route("/getVideoById/:videoId").get(getVideoById)

export default router