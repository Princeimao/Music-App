import mongoose from "mongoose";

const SongSchema = new mongoose.Schema(
  {
    spotify_id: {
      type: String,
      required: true,
      unique: true,
    }, // Spotify song ID
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
    }, // Optional, album name
    album_cover: {
      type: String,
    }, // URL to album cover image
    duration: {
      type: Number,
    }, // Duration of the song in seconds
    url: {
      type: String,
      required: true,
    }, // URL to stream the song (from Spotify)
  },
  { timestamps: true }
);

module.exports = mongoose.model("Song", SongSchema);
