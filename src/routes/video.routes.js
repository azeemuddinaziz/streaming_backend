import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js";

const router = Router();

router.route("/publishVideo").post(
  verifyJWT,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router.route("/search/:videoId").get(getVideoById);

router
  .route("/edit/:videoId")
  .post(verifyJWT, upload.single("thumbnail"), updateVideo);

export default router;
