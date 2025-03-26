import axios from "axios";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import userModel from "../model/user.model";

export const createUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    const googleResponse = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    );

    // Google response to check what will come in the response
    console.log("googleResponse ", googleResponse);

    const { email, name, sub: googleId, picture } = googleResponse.data;

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
      return;
    }

    const authToken = jwt.sign(
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

    res.status(200).json({
      success: true,
      message: "user login successfully",
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("something went wrong while creating an user", error);
    res.status(401).json({
      error: "Invalid Google Token",
      success: false,
    });
  }
};
