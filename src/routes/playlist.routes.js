import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist } from "../controllers/playlist.contoller.js";

const router = Router();

router.route("/create").post(verifyJWT, createPlaylist);

export default router;
