import express from "express"
import {varifyjwt} from "../middlewares/auth.middlewares.js"
import { addVideoToPlayList, createPlaylist, getPlayListById, removeVideoFromPlayList } from "../controllers/playList.controllers.js"

const router = express.Router()

router.use(varifyjwt)

router.route("/createPlayList").post(createPlaylist)
router.route("/addVideoToPlayList/:videoId/:playListId").post(addVideoToPlayList)
router.route("/removeVideoFromPlayList/:playListId/:videoId").post(removeVideoFromPlayList)
router.route("/playListById/:playListId").get(getPlayListById)

export default router