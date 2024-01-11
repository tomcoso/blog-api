const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, required: true, ref: "admin" },
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true, default: new Date() },
  media: { type: String, required: false },
  status: { type: String, required: true, default: "unpublished" },
});

module.exports = mongoose.model("post", PostSchema);
