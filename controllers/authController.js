const Admin = require("../models/admins");
const debug = require("debug")("app:auth");
const StandardError = require("../errors/standardError");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.auth_login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Admin.findOne({ email }).exec();
  if (!user) {
    return next(new StandardError("No user found", { email }, 400));
  }
  debug(user);

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return next(new StandardError("Incorrect password", { email }, 400));
  }

  const secret = process.env.SECRET_JWT_KEY;
  const token = jwt.sign({ email }, secret, { expiresIn: "12h" });
  return res.status(200).json({ message: "Auth passed", token });
});

exports.auth_signup = asyncHandler(async (req, res, next) => {
  if (!req.body.secret || req.body.secret !== process.env.NEW_ADMIN_SECRET) {
    return next(new StandardError("Unauthorized to create new admin", {}, 401));
  }
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(new StandardError("Error hashing password", err));
      }
      const user = new Admin({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
      });
      await user.save();
    });

    return res.status(201).json({ user });
  } catch (err) {
    return next(new StandardError("Internal database error", err, 503));
  }
});
