import express from "express";
import {
  addSongToQueue,
  addUser,
  addVote,
  createParty,
  getQueuedSong,
  removeVote,
} from "../controller/party.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/create").post(authMiddleware, createParty);
router.route("/addSong/:id").post(authMiddleware, addSongToQueue);
router.route("/addVote").post(authMiddleware, addVote);
router.route("/removeVote").post(authMiddleware, removeVote);
router.route("/join/:inviteCode").post(authMiddleware, addUser);
router.route("/party/:id").post(authMiddleware, getQueuedSong);

export default router;
