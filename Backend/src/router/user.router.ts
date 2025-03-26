import express from "express";
import {
  googleAuthHandler,
  spotifyAuthorization,
} from "../controller/user.controller";

const router = express.Router();

// @ts-ignore
router.route("/register").post(googleAuthHandler);
router.route("/spotify").post(spotifyAuthorization);

export default router;
