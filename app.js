const express = require("express");
const path = require("path");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const postsRouter = require("./routes/posts");
const authController = require("./routes/auth");

require("dotenv").config({ path: `./config/.env.${process.env.NODE_ENV}` });

const app = express();

// MONGO DB
const mongoDb = process.env.MONGO_CONNECTION_STRING;
mongoose.set("strictQuery", false);

async function main() {
  await mongoose.connect(mongoDb);
}
main().catch((err) => console.error(err));

// Auth
const passport = require("passport");
const jwtStrategy = require("./strategies/jwt");
passport.use(jwtStrategy);

// MIDDLEWARE
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// ROUTES
app.use("/posts", postsRouter);
app.use("/auth", authController);

app.use((req, res, next) => {
  res.sendStatus(404);
});

module.exports = app;
