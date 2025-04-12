import express from "express";
import {
  getNewAccessToken,
  getUser,
  googleAuthHandler,
  spotifyAuthorization,
} from "../controller/user.controller";

import { authMiddleware } from "./../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(googleAuthHandler);
router.route("/spotify").get(spotifyAuthorization);
router.route("/getUser").get(authMiddleware, getUser);
router.route("/getAccessToken").post(getNewAccessToken);

export default router;
