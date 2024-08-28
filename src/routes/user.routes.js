import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//routes declaration
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

//secured routes
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/refreshToken").post(refreshAccessToken);

router.route("/changePassword").post(verifyJWT, changeCurrentPassword);

router.route("/currentUser").post(verifyJWT, getCurrentUser);

router.route("/:username").post(verifyJWT, getUserChannelProfile);

router
  .route("/updateAvatar")
  .post(upload.single("avatar"), verifyJWT, updateAvatar);

router
  .route("/updateCoverImage")
  .post(upload.single("coverImage"), verifyJWT, updateCoverImage);

export default router;
