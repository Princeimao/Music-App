import { Response } from "express";

import { IUserRequest } from "../middlewares/auth.middleware";
import partyModel from "../model/party.model";
import songModel from "../model/song.model";
import userModel from "../model/user.model";

export const createParty = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { name } = req.body;

    const party = await partyModel.create({
      room_name: name,
      admins: userId,
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
