import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
} from "../controllers/video.controller.js";

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
  .patch("/edit/:videoId")
  .post(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/delete/:videoId").delete(verifyJWT, deleteVideo);

router
  .route("/togglePublishStatus/:videoId")
  .patch(verifyJWT, togglePublishStatus);

router.route("/results").get(getAllVideos);

export default router;
