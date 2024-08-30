import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  getPlaylistById,
  getUserPlaylists,
} from "../controllers/playlist.contoller.js";

const router = Router();

router.route("/getUsersPlaylists/:userId").get(getUserPlaylists);
router.route("/getPlaylistById/:playlistId").get(getPlaylistById);

//secured routes
router.route("/create").post(verifyJWT, createPlaylist);
router
  .route("/addVideo/:playlistId/:videoId")
  .post(verifyJWT, addVideoToPlaylist);

export default router;
