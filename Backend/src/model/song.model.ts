import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  song_id: {
    type: String,
    required: true,
  }, // Spotify song ID
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  }, // Duration in milliseconds
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

export default mongoose.model("Song", SongSchema);
