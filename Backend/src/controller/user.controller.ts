import axios from "axios";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../model/user.model";
import { client } from "../utils/google.utils";

declare module "express-session" {
  interface SessionData {
    user?: {
      googleId: string;
      email: string;
      name: string;
      profilePic: string;
    };
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
  }
}

export const googleAuthHandler = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    // Google response to check what will come in the response
    console.log("googleResponse ", payload);

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

    if (!user) {
      return res.json({
        isNewUser: true,
        googleId,
        email,
        name,
        profilePic: picture,
        spotifyAuthUrl: `https://accounts.spotify.com/authorize?client_id=${
          process.env.SPOTIFY_CLIENT_ID
        }&response_type=code&redirect_uri=${
          process.env.BACKEND_URL
        }/auth/spotify&scope=${encodeURIComponent(
          "user-read-private user-read-email user-modify-playback-state playlist-modify-public"
        )}`,
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        error: "Server configuration error: JWT_SECRET is missing",
      });
    }

    req.session.user = {
      googleId,
      email,
      name,
      profilePic: picture,
    };

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

    res.cookie("token", authToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      success: true,
      message: "user logged in successfully",
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("something went wrong while creating an user", error);
    return res.status(401).json({
      error: "Invalid Google Token",
      success: false,
    });
  }
};

export const spotifyAuthorization = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;

    if (
      !process.env.BACKEND_URL ||
      !process.env.SPOTIFY_CLIENT_ID ||
      !process.env.SPOTIFY_CLIENT_SECRET
    ) {
      return;
    }

    const tokenRes = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.BACKEND_URL + "/auth/spotify",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // checking what inside the token
    console.log(tokenRes);

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    let user = await userModel.create({
      googleId: req.session.user!.googleId,
      email: req.session.user!.email,
      name: req.session.user!.name,
      profilePic: req.session.user!.profilePic,
      spotifyAccessToken: access_token,
      spotifyRefreshToken: refresh_token,
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

    res.json({ accessToken: authToken, user });
  } catch (error) {
    console.log("something went wrong while authorize from spotfiy", error);
  }
};
