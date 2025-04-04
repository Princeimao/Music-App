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
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
