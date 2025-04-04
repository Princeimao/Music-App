import axios from "axios";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import querystring from "querystring";

import { IUserRequest } from "../middlewares/auth.middleware";
import userModel from "../model/user.model";
import { client } from "../utils/google.utils";
import {
  currentUserPlaylist,
  generateRandomString,
  pushPlaylistToDatabase,
} from "../utils/helper";
import { redisClient } from "../utils/redis.client";

export interface IRedisData {
  googleId: string;
  email: string;
  picturePic: string;
  name: string;
}

export const googleAuthHandler = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const {
      email,
      name,
      sub: googleId,
      picture,
    } = payload as {
      email: string;
      name: string;
      picture: string;
      sub: string;
    };

    const user = await userModel.findOne({ email: email });

    const scope =
      "user-read-private user-read-email user-modify-playback-state playlist-modify-public";
    const state = generateRandomString(16);

    if (!user) {
      const data = JSON.stringify({
        googleId,
        email,
        picturePic: picture,
        name,
      });

      await redisClient.set(state, data);

      res.json({
        isNewUser: true,
        googleId,
        email,
        name,
        profilePic: picture,
        spotifyAuthUrl:
          "https://accounts.spotify.com/authorize?" +
          querystring.stringify({
            response_type: "code",
            client_id: process.env.SPOTIFY_CLIENT_ID,
            scope,
            redirect_uri: process.env.REDIRECT_URL,
            state,
          }),
      });
      return;
    }

    if (!process.env.JWT_SECRET) {
      return;
    }
    const authToken = await jwt.sign(
      {
        userId: user?._id,
        email: user?.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profile_picture,
      },
      token: authToken,
    });
  } catch (error) {
    console.log("something went wrong while creating an user", error);
    res.status(401).json({
      error: "Invalid Google Token",
      success: false,
    });
    return;
  }
};

// TODO: While authenticating i did not checking the state this will help to check is there is some cross site attack
export const spotifyAuthorization = async (req: Request, res: Response) => {
  try {
    // The code is short time authorization code which give me access token and refresh token in exchange
    const { code, state } = req.query as {
      code: string;
      state: string;
    };

    if (
      !process.env.FRONTEND_URL ||
      !process.env.SPOTIFY_CLIENT_ID ||
      !process.env.SPOTIFY_CLIENT_SECRET
    ) {
      return;
    }

    if (!code) {
      res.status(400).json({
        error: "Authorization code not found",
      });
      return;
    }

    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: "http://localhost:3000/api/user/spotify",
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

    //@ts-ignore
    const data: IRedisData = JSON.parse(await redisClient.get(state));

    if (!data) {
      res.status(500).json({
        success: false,
        message: "something went wrong while getting the data from redis",
      });
    }

    const { access_token, refresh_token } = tokenRes.data;

    const user = await userModel.create({
      google_id: data.googleId,
      email: data.email,
      name: data.name,
      profile_picture: data.picturePic || "",
      spotify_access_token: access_token,
      spotify_refresh_token: refresh_token,
    });

    pushPlaylistToDatabase(user._id, access_token);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    const authToken = await jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    await redisClient.del(state);

    res.status(200).json({
      message: "created user",
      jwt: authToken,
    });
  } catch (error) {
    console.log("something went wrong while authorize from spotfiy", error);
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getUser = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    const cachedUser = await redisClient.get(`user:${userId}`);

    if (cachedUser) {
      res.status(200).json({
        success: true,
        message: "successfully",
        user: JSON.parse(cachedUser),
      });
    }

    const user = await userModel
      .findById(userId)
      .select(
        "name email profile_picture playlists liked_songs parties access_token"
      )
      .populate("playlists")
      .populate("liked_songs")
      .populate("parties");

    console.log(user);

    if (!user) {
      res.status(400).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    await redisClient.set(`user:${userId}`, JSON.stringify(user));

    res.status(200).json({
      success: true,
      message: "successfully",
      user,
    });
  } catch (error) {
    console.log("something went wrong getting user", error);
  }
};

export const getPlaylist = async (req: IUserRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      throw new Error("user not found");
    }
    const response = await currentUserPlaylist(user?.spotify_access_token);

    res.status(200).json(response);
  } catch (error) {
    console.log("something went wrong", error);
  }
};
