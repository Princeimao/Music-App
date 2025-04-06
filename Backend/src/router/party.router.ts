import express from "express";
import {
  addSongToQueue,
  createParty,
  removeVote,
  voteSong,
} from "../controller/party.controller";

const router = express.Router();

router.route("/create").post(createParty);
router.route("/addSong").post(addSongToQueue);
router.route("/addVote").post(voteSong);
router.route("/removeVote").post(removeVote);

export default router;
