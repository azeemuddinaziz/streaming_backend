import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createTweet);

router.route("/getUserTweets/:userId").get(getUserTweets);

router.route("/update/:tweetId").patch(verifyJWT, updateTweet);

export default router;
