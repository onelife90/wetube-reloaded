import mongoose from "mongoose";
import moment from "moment-timezone";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  createdAt: {
    type: Date,
    required: true,
    default: () => moment.tz("Asia/Seoul").format(),
  },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
