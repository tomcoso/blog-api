const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  post: { type: Schema.Types.ObjectId, required: true, ref: "post" },
  username: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: String, required: true, default: new Date() },
});

module.exports = mongoose.model("comment", CommentSchema);
