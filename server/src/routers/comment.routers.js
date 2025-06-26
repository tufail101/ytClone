import express, { Router } from "express";
import {
  deleteComment,
  getVideoComment,
  publishCommentOnComment,
  publishCommentOnVideo,
} from "../controllers/comment.controllers.js";
import { varifyjwt } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(varifyjwt);

router.route("/postVideoCommnet/:videoId").post(publishCommentOnVideo);
router.route("/getVideoComment/:videoId").get(getVideoComment);
router
  .route("/publishCommentOnComment/:commentId")
  .post(publishCommentOnComment);
router.route("/delete/:commentId").patch(deleteComment);

export default router;
