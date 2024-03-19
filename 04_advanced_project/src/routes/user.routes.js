import { Router } from "express";

// Importing all our user controllers
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";

// importing our custom made middleware to extend the functionality to upload files on cloudinary.
import { upload } from "../middlewares/multer.middleware.js";

// importing our custom made middleware to authenticate the user before running any controller,.
import { verifyJWT } from "../middlewares/auth.middleware.js";

// configuring our controller
const router = Router();

// Route 1 : Register New User
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
    },
  ]),
  registerUser
);

// Route 2 : Login User
router.route("/login").post(loginUser);

// Route 3 : Logout User
router.route("/logout").post(verifyJWT, logoutUser);

// Route 4 : Refresh the Tokens
router.route("/refresh-token").post(refreshAccessToken);

// Route 5 : Change User Password
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// Route 6 : Get Current User
router.route("/current-user").get(verifyJWT, getCurrentUser);

// Route 7 : Update User Account Details
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;
