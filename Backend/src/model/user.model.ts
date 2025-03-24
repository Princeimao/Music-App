import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minimum: [2, "Name atleast 2 charater long"],
    maximum: 40,
  },
  username: {
    type: String,
    unique: true,
    required: true,
    minimum: [2, "Name atleast 2 charater long"],
    maximum: 40,
  },
  playlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Playlist",
    },
  ],
  like: [
    {
      type: String,
      validate:
        /^(https:\/\/open.spotify.com\/user\/spotify\/playlist\/|spotify:user:spotify:playlist:)([a-zA-Z0-9]+)(.*)$/gm, 
    },
  ],
});
