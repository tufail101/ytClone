import express from "express"
import {varifyjwt} from "../middlewares/auth.middlewares.js"
import { addVideoToPlayList, createPlaylist, deletePlaylist, getPlayListById, removeVideoFromPlayList, updatePlayList } from "../controllers/playList.controllers.js"

const router = express.Router()

router.use(varifyjwt)

router.route("/createPlayList").post(createPlaylist)
router.route("/addVideoToPlayList/:videoId/:playListId").post(addVideoToPlayList)
router.route("/removeVideoFromPlayList/:playListId/:videoId").post(removeVideoFromPlayList)
router.route("/playListById/:playListId").get(getPlayListById)
router.route("/update/:playListId").patch(updatePlayList)
router.route("/delet/:playListId").delete(deletePlaylist)


export default router