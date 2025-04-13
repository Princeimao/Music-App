import express from "express";
import {
  getNewAccessToken,
  getUser,
  googleAuthHandler,
  logout,
  spotifyAuthorization,
} from "../controller/user.controller";

import { authMiddleware } from "./../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(googleAuthHandler);
router.route("/spotify").get(spotifyAuthorization);
router.route("/getUser").get(authMiddleware, getUser);
router.route("/getAccessToken").post(getNewAccessToken);
router.route("/logout").post(authMiddleware, logout);

export default router;
