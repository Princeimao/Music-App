import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema(
  {
    spotifyId: {
      type: String,
      required: true,
    },
    images: [
      {
        url: String,
        height: Number,
        width: Number,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    public: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Playlist", PlaylistSchema);
