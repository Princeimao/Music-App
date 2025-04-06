import { Response } from "express";

import { IUserRequest } from "../middlewares/auth.middleware";
import partyModel from "../model/party.model";
import songModel from "../model/song.model";
import userModel from "../model/user.model";
import { generateRandomString } from "../utils/helper";

export const createParty = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;

    const randomString = generateRandomString(6);

    const party = await partyModel.create({
      room_name: name,
      admins: userId,
      inviteCode: randomString,
    });

    if (!party) {
      res.status(500).json({
        success: false,
        message: "internal server error",
      });
      return;
    }

    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { parties: userId },
    });

    res.status(200).json({
      success: true,
      message: "Party Created Successfully",
    });
  } catch (error) {
    console.log("something went wrong creating party", error);
    res.status(400).json({
      success: false,
      message: "soemthing went wrong while creating party",
    });
  }
};

export const addSongToQueue = async (req: IUserRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    // user will search the song from spotify (will done on fromtend) then send me the response to
    // backend i will save the details like song id, artist, title, etc

    const { song_id, title, artist, duration } = req.body;

    const party = await partyModel.findById(id);

    if (!party) {
      res.status(400).json({
        success: false,
        message: "Party not found",
      });
      return;
    }

    const queuedSong = await songModel.create({
      song_id,
      title,
      artist,
      duration,
      added_by: userId,
      votes: userId,
    });

    if (!queuedSong) {
      res.status(500).json({
        success: false,
        message: "Something went wrong adding song to queue",
      });
      return;
    }

    await partyModel.findByIdAndUpdate(id, { $addToSet: { queue: userId } });

    res.status(200).json({
      success: true,
      message: "Song added to queue successfully",
    });
  } catch (error) {
    console.log("something went while adding song to queue", error);
    res.status(500).json({
      success: false,
      message: "something went while adding song to queue",
    });
  }
};

export const addVote = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { songId } = req.body;

    const song = await songModel.findByIdAndUpdate(songId, {
      $addToSet: { votes: userId },
    });

    if (!song) {
      res.status(400).json({
        success: false,
        message: "song not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "song voted successfully",
    });
  } catch (error) {
    console.log("something went wrong while liking the song", error);
    res.status(500).json({
      success: false,
      message: "something went wrong while liking the song",
    });
  }
};

export const removeVote = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { songId } = req.body;

    const song = await songModel.findByIdAndUpdate(songId, {
      $pull: { votes: userId },
    });

    if (!song) {
      res.status(400).json({
        success: false,
        message: "song not found",
      });
      return;
    }

    res.status(200).json({
      success: false,
      message: "Vote removed successfully",
    });
  } catch (error) {
    console.log("something went wrong removing vote", error);
    res.status(500).json({
      success: false,
      message: "something went wrong while removing vote",
    });
  }
};

export const addUser = async (req: IUserRequest, res: Response) => {
  try {
    const { inviteCode } = req.params;
    const userId = req.user?.userId;

    const party = await partyModel.findOne({ inviteCode });

    if (!party) {
      res.status(400).json({
        success: false,
        message: "Invalid Party Code",
      });
      return;
    }

    //@ts-ignore
    if (party.invitedMembers.includes(userId)) {
      res.status(400).json({
        success: false,
        message: "User already exist",
      });
      return;
    }

    //@ts-ignore
    party.invitedMembers.push(userId);
    await party.save();

    res.status(200).json({
      message: "Joined party!",
      partyId: party._id,
    });
  } catch (error) {
    console.log("something went wrong adding user to party", error);
    res.status(400).json({
      success: false,
      message: "something went wrong adding user to party",
    });
  }
};

export const getQueuedSong = async (req: IUserRequest, res: Response) => {
  try {
    const { id } = req.params;

    const party = await partyModel.findById(id).populate("queue");

    if (!party) {
      res.status(400).json({
        success: false,
        message: "Party Not Found",
      });
      return;
    }

    res.status(200).json({
      success: false,
      message: "Party Found Successfully",
      party,
    });
  } catch (error) {
    console.log("Something went wrong while getting song", error);
    res.status(500).json({
      success: false,
      message: "something went wrong while getting song from party",
    });
  }
};
