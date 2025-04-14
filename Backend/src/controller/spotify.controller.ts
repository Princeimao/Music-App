import axios from "axios";
import { Response } from "express";
import querystring from "querystring";
import { IUserRequest } from "../middlewares/auth.middleware";
import userModel from "../model/user.model";

export const searchSuggestion = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { searchTerm, type } = req.body;

    const user = await userModel
      .findById(userId)
      .select("spotify_access_token")
      .populate({
        path: "songHistory",
        match: { title: { $regex: searchTerm, $options: "i" } },
        options: {
          limit: 4,
        },
      })
      .lean(true);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found || User not authenticated",
      });
      return;
    }

    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${querystring.stringify({
        q: searchTerm,
        type: type,
        limit: 10,
      })}`,
      {
        headers: {
          Authorization: `Bearer ${user.spotify_access_token}`,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Search suggestion fetched successfully",
      searchSuggestion: {
        artists: response.data?.artists?.items,
        albums: response.data?.albums?.items,
        tracks: response.data?.tracks?.items,
        playlists: response.data?.playlists?.items,
        alreadyPlayed: user.songHistory,
      },
    });
  } catch (error) {
    console.log("Error in search suggestion", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while getting search suggestion",
    });
  }
};

export const lastPlayedSong = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { page = 0 } = req.body;
    const limit = 20;

    const user = await userModel
      .findById(userId)
      .select("songHistory")
      .populate({
        path: "songHistory",
        options: {
          sort: { createdAt: -1 },
          skip: page * limit,
          limit: limit,
        },
      });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found || User not authenticated",
      });
      return;
    }

    if (user.songHistory.length === 0) {
      res.status(400).json({
        success: false,
        message: "No song history found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Last played song fetched successfully",
      lastPlayedSong: user.songHistory,
    });
  } catch (error) {
    console.log(
      "something went wrong while getting the last Played song",
      error
    );
    res.status(500).json({
      success: false,
      message: "Something went wrong while getting the last Played song",
    });
  }
};

export const updateLastPlayedSong = async (
  req: IUserRequest,
  res: Response
) => {
  try {
    const {
      spotify_id,
      title,
      artist,
      album,
      album_cover,
      duration,
      url,
      playedTimes,
    } = req.body;

    // can be improved by using a queue system (rabbitMQ or kafka)
    const userId = req.user?.userId;
    const user = await userModel.findById(userId).lean(true);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found || User not authenticated",
      });
      return;
    }

    const updateResult = await userModel.updateOne(
      { _id: userId, "songHistory.spotify_id": spotify_id },
      {
        $inc: { "songHistory.$.playedTimes": 1 },
        $set: { "songHistory.$.lastPlayedAt": new Date() },
      }
    );

    if (updateResult.modifiedCount === 0) {
      await userModel.updateOne(
        { _id: userId },
        {
          $push: {
            songHistory: {
              spotify_id,
              title,
              artist,
              album,
              album_cover,
              duration,
              url,
              playedTimes: 1,
              createdAt: new Date(),
            },
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Song updated",
    });
  } catch (error) {
    console.log("Error in updating last played song", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating last played song",
    });
  }
};
