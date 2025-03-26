import mongoose, { Document } from "mongoose";

interface IUser extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  username: string;
  google_id: string;
  email: string;
  profile_picture: string;
  playlists: mongoose.Schema.Types.ObjectId[];
  liked_songs: string[];
  parties: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    google_id: {
      type: String,
      required: true,
      unique: true,
    }, // Optional, only if using Google Auth
    email: {
      type: String,
      unique: true,
      required: true,
    }, // Optional: if you want to store email
    profile_picture: {
      type: String,
    }, // URL to the user's profile picture
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
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
