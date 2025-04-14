import mongoose from "mongoose";

const SongHistorySchema = new mongoose.Schema(
  {
    spotify_id: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
    album: {
      type: String,
    },
    album_cover: {
      type: String,
    },
    duration: {
      type: Number,
    },
    url: {
      type: String,
      required: true,
    },
    playedTimes: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SongHistory", SongHistorySchema);
