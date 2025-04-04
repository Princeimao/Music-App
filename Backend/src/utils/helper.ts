import axios from "axios";
import crypto from "crypto";
import { ObjectId } from "mongoose";
import qs from "qs";
import playlistModel from "../model/playlist.model";
import userModel from "../model/user.model";
import { redisClient } from "./redis.client";

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

export const newAccessToken = async (userId: string) => {
  try {
    const data = await redisClient.get(userId);

    if (data) {
      const cachedUser = JSON.parse(data);

      if (cachedUser) {
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          qs.stringify({
            grant_type: "refresh_token",
            refresh_token: cachedUser.spotify_refresh_token,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                Buffer.from(
                  process.env.SPOTIFY_CLIENT_ID +
                    ":" +
                    process.env.SPOTIFY_CLIENT_SECRET
                ).toString("base64"),
            },
          }
        );

        return response;
      }
    }

    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        grant_type: "refresh_token",
        refresh_token: user.spotify_refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.SPOTIFY_CLIENT_ID +
                ":" +
                process.env.SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );

    return response;
  } catch (error) {
    console.log("something went wrong while creating new access token");
  }
};

export const currentUserPlaylist = async (token: string) => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(
      "something went wrong while getting the playlist from spotify",
      error
    );
    return {
      success: false,
      message: "something went wrong while getting the playlist from spotify",
    };
  }
};

export const pushPlaylistToDatabase = async (
  userId: ObjectId,
  token: string
) => {
  try {
    const playlists = await currentUserPlaylist(token);

    if (!playlists.items.length) {
      return;
    }

    //@ts-ignore
    const playlistDocs = playlists.items.map((playlist) => ({
      spotifyId: playlist.id,
      images: playlist.images,
      name: playlist.owner.display_name,
      description: playlist.description,
      author: userId,
    }));

    const data = await playlistModel.bulkWrite(
      //@ts-ignore
      playlistDocs.map((playlist) => ({
        updateOne: {
          filter: { spotifyId: playlist.spotifyId, author: userId },
          update: { $set: playlist },
          upsert: true,
        },
      }))
    );

    const upsertedIds = Object.values(data.upsertedIds);

    // update the user field
    if (upsertedIds.length > 0) {
      await userModel.findByIdAndUpdate(userId, {
        $addToSet: { playlists: { $each: upsertedIds } },
      });

      console.log("User's playlist references updated!");
    }

    return;
  } catch (error) {
    console.log("Something went wrong while push playlist to database", error);
  }
};
