import express from "express"
import { changeCurrentPassword, getCurrentUser, getUserProfile, login, logoutUser, refreshAccessToken, register, updateAccountDetails, updateUserAvatar, updateUserCoverImg } from "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middlewares.js"
import {varifyjwt} from "../middlewares/auth.middlewares.js"

const router = express.Router()

router.route("/register").post(upload.fields([
    {
        name : "avatar",
        maxCount : 1
    },
    {
        name : "coverImage",
        maxCount : 1
    }
]),register)

router.route("/login").post(login)
router.route("/refreshAccessToken").post(refreshAccessToken)
router.route("/logout").post(varifyjwt,logoutUser)
router.route("/changeCurrentPassword").post(varifyjwt,changeCurrentPassword)
router.route("/updateUserDetails").patch(varifyjwt,updateAccountDetails)
router.route("/updateUserAvatar").patch(
    varifyjwt,
    upload.single("avatar"),
    updateUserAvatar
)
router.route("/updateUserCoverImg").post(
    varifyjwt,
    upload.single("coverImage"),
    updateUserCoverImg
)
router.route("/getCurrentUser").get(varifyjwt,getCurrentUser)

router.route("/getUserProfile/:userId").get(getUserProfile)

export default router