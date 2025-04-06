import mongoose from "mongoose";

const PartySchema = new mongoose.Schema(
  {
    room_name: {
      type: String,
      required: true,
    },
    invitedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admins: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    queue: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Song",
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
    inviteCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Party", PartySchema);
