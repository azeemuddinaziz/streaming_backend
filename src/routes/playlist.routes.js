import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
} from "../controllers/playlist.contoller.js";

const router = Router();

router.route("/create").post(verifyJWT, createPlaylist);
router.route("/getUsersPlaylists/:userId").get(getUserPlaylists);
router.route("/getPlaylistById/:playlistId").get(getPlaylistById);

export default router;
