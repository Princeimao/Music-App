import express from "express";
import {
  getUser,
  googleAuthHandler,
  spotifyAuthorization,
} from "../controller/user.controller";
import { newAccessToken } from "../utils/helper";
import { authMiddleware } from "./../middlewares/auth.middleware";

const router = express.Router();

router.route("/register").post(googleAuthHandler);
router.route("/spotify").get(spotifyAuthorization);
router.route("/getUser").get(authMiddleware, getUser);
router.route("/testing/:id").get(newAccessToken);

export default router;
