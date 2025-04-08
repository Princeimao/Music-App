import axios from "axios";
import { Request, Response } from "express";
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
    console.log("i am here");
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        success: false,
        message: "token not found",
      });
      return;
    }

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

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refresh_token = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      sameSite: "none",
    });

    res.status(200).json({
      success: true,
      message: "Login Successfully",
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profile_picture,
      },
      tokens: {
        accessToken,
        refreshToken,
        spotifyAccessToken: user.spotify_access_token,
      },
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

// TODO: While authenticating i did not checking the state this will help to check is there is
// some cross site attack
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

    await redisClient.del(state);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();
    await pushPlaylistToDatabase(user._id, access_token);

    user.refresh_token = refreshToken;
    await user.save();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined");
    }

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
    });

    res.status(200).redirect(process.env.FRONTEND_URL);
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
      return;
    }

    const user = await userModel
      .findById(userId)
      .select(
        "name email profile_picture playlists liked_songs parties spotify_access_token"
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

// {
//     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2YyOThlYzkyZDI4YjgxYjMxYWEwM2YiLCJlbWFpbCI6InBnODc1MDI5NDM2NjU1QGdtYWlsLmNvbSIsImlhdCI6MTc0NDAzODQxMiwiZXhwIjoxNzQ0MDQyMDEyfQ.5yIOyOvKH7aLWTXCCgqGfvfPo9ShAY_Z6RN5ZDUYos8",

//     "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2YyOThlYzkyZDI4YjgxYjMxYWEwM2YiLCJpYXQiOjE3NDQwMzg0MTIsImV4cCI6MTc0NDA0MjAxMn0.0C21seVWGylehudR5w4zY0EpX0gQuw8Nvxn9nx4cJiE",

//     "spotifyAccessToken": "BQC9waC-XYFpR6vDnc_h7fowVcdibjg2hjmPeGekjcl4S_hMM7XY4trujcYjcm_HcCVriguW4CcjhbM7nxtsdyvo5rlreYtY9YjkWz65eFh6pdZaR0dxW45_GrcCfRo1RbYcQrKu49P1x4f9-EkiriubzBezpT6qR9xIoK8ksZ02IVtnM0Vr-cSuD8qC_rSr82LvjbvIDtGCHnEvSSEM_LBvipE3eJkjaiwAhtx6wfkQ5aeQhZiISWgU71BPO4V-X-j5cQdMedS8r2v6vKg-"
// }
