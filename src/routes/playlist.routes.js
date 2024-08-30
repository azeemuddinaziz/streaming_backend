import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
} from "../controllers/playlist.contoller.js";

const router = Router();

router.route("/create").post(verifyJWT, createPlaylist);
router.route("/getPlaylists/:userId").get(getUserPlaylists);

export default router;
