import express from "express";
import {
  googleAuthHandler,
  spotifyAuthorization,
} from "../controller/user.controller";

const router = express.Router();

router.route("/register").post(googleAuthHandler);
router.route("/spotify").get(spotifyAuthorization);

export default router;
