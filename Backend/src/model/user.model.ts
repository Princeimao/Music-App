import jwt from "jsonwebtoken";
import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  google_id: string;
  email: string;
  profile_picture: string;
  playlists: mongoose.Schema.Types.ObjectId[];
  liked_songs: string[];
  parties: mongoose.Schema.Types.ObjectId[];
  spotify_refresh_token: string;
  spotify_access_token: string;
  refresh_token: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    google_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    profile_picture: {
      type: String,
    },
    playlists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Playlist",
      },
    ], // Reference to playlists
    liked_songs: [
      {
        type: String,
      },
    ], // Array of song URLs or song IDs from Spotify API
    parties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Party",
      },
    ], // Reference to parties the user has joined
    spotify_refresh_token: {
      type: String,
    },
    spotify_access_token: {
      type: String,
    },
    refresh_token: {
      type: String,
    },
  },
  { timestamps: true }
);

UserSchema.methods.generateAccessToken = async function () {
  try {
    if (!process.env.JWT_SECRET) {
      return;
    }
    const token = await jwt.sign(
      {
        userId: this._id,
        email: this.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return token;
  } catch (error) {
    console.log("something went wrong while creating access token", error);
  }
};

UserSchema.methods.generateRefreshToken = async function () {
  try {
    if (!process.env.JWT_SECRET) {
      return;
    }
    const token = await jwt.sign(
      {
        userId: this._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return token;
  } catch (error) {
    console.log("something went wrong while generating refresh token", error);
  }
};

export default mongoose.model<IUser>("User", UserSchema);
