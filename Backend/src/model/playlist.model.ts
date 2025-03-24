import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    visibility: {
      type: String,
      enum: ["Private", "Public"],
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Song hold the url of the spotify api
    songs: [
      {
        type: String,
      },
    ],
    // user can write the description that what type of song was inside that playlist
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Playlist", PlaylistSchema);
