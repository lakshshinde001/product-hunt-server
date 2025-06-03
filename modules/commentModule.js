import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true, 
      trim: true,
    },
    nestedComments: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null, 
    },
  },
  { timestamps: true }
);

export const Comment = mongoose.model("Comment", commentSchema);
