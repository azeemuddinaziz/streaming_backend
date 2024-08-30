import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTweet, getUserTweets } from "../controllers/tweet.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, createTweet);

router.route("/getUserTweets/:userId").post(getUserTweets);

export default router;
