import express from "express";
import {
  lastPlayedSong,
  searchSuggestion,
} from "../controller/spotify.controller";
import { authMiddleware } from "./../middlewares/auth.middleware";

const router = express.Router();

router.route("/searchSuggestion").get(authMiddleware, searchSuggestion);
router.route("/lastPlayedSong").get(authMiddleware, lastPlayedSong);

export default router;
