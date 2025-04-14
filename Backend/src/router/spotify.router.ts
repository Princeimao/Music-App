import express from "express";
import { lastPlayedSong, searchSuggestion } from "../controller/spotify.controller";

const router = express.Router();

router.route("/searchSuggestion").get(searchSuggestion);
router.route("/lastPlayedSong").get(lastPlayedSong);

export default router;
