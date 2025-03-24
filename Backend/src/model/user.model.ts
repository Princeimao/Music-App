import mongoose from "mongoose";

// User Schema
const UserSchema = new mongoose.Schema(
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
    password: {
      type: String,
    }, // Only required if not using Google Auth
    google_id: {
      type: String,
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

export default mongoose.model("User", UserSchema);
