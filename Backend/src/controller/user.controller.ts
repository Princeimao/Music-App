import axios from "axios";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import querystring from "querystring";

import userModel from "../model/user.model";
import { client } from "../utils/google.utils";
import { generateRandomString } from "../utils/helper";
import { redisClient } from "../utils/redis.client";

interface IRedisData {
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

    const user = await userModel.findOne({ google_id: googleId });
    const scope =
      "user-read-private user-read-email user-modify-playback-state playlist-modify-public";
    const state = generateRandomString(16);

    const data = JSON.stringify({
      googleId,
      email,
      picturePic: picture,
      name,
    });

    redisClient.set(state, data);

    if (!user) {
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

    let user = await userModel.create({
      google_id: data.googleId,
      email: data.email,
      name: data.name,
      profile_picture: data.picturePic || "",
      spotify_access_token: access_token,
      spotify_refresh_token: refresh_token,
    });

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

    res.status(200).json({
      accessToken: authToken,
      user: {
        name: user.name,
        email: user.email,
        profilePic: user.profile_picture,
      },
      message: "user created successfully",
    });
  } catch (error) {
    console.log("something went wrong while authorize from spotfiy", error);
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
