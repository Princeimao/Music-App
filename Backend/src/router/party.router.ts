import express from "express";
import {
  addSongToQueue,
  addVote,
  createParty,
  removeVote,
} from "../controller/party.controller";

const router = express.Router();

router.route("/create").post(createParty);
router.route("/addSong/:id").post(addSongToQueue);
router.route("/addVote").post(addVote);
router.route("/removeVote").post(removeVote);
router.route("/join/:inviteCode").post();

export default router;
