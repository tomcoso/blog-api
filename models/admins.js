const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, requried: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("admin", AdminSchema);
