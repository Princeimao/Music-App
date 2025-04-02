import axios from "axios";
import crypto from "crypto";
import qs from "qs";
import userModel from "../model/user.model";
import { redisClient } from "./redis.client";

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

export const getPlaylist = (token: string) => {
  try {
    // const response =
  } catch (error) {
    console.log(
      "something went wrong while getting the playlist from spotify",
      error
    );
  }
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
  } catch (error) {
    console.log("something went wrong while creating new access token");
  }
};
