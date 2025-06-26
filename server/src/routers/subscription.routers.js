import express from "express"
import {varifyjwt} from "../middlewares/auth.middlewares.js"
import { getSubscribedChannel, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controllers.js"

const router = express.Router()

router.use(varifyjwt)

router.route("/toggleSubscription/:channelId").post(toggleSubscription)
router.route("/getUserChannelSubscribers/:channelId").get(getUserChannelSubscribers)
router.route("/getSubscribedChannel").get(getSubscribedChannel)

export default router