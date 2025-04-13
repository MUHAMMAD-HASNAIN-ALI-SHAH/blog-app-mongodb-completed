const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
  {
    blogID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.index({ blogID: 1, userID: 1 }, { unique: true }); // prevent duplicate likes

module.exports = mongoose.model("Like", likeSchema);
