import mongoose from "mongoose";
import songModel from "./song.model";

const PartySchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    co_admins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    queue: [songModel],
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Party", PartySchema);
