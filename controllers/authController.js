const Admin = require("../models/admins");
const debug = require("debug")("blog-api:auth");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.auth_login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await Admin.findOne({ email }).exec();
  if (!user) {
    res.status(400).json({ message: "No user found" });
    return;
  }
  debug(user);

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    res.status(403).json({ message: "Incorrect password" });
    return;
  }

  const secret = process.env.SECRET_JWT_KEY;
  const token = jwt.sign({ email }, secret, { expiresIn: "12h" });
  return res.status(200).json({ message: "Auth passed", token });
});

exports.auth_signup = asyncHandler(async (req, res, next) => {
  try {
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        throw new Error("Error hashing password");
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
    return res.status(400).json({ message: err.message });
  }
});
