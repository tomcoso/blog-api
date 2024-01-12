const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const mongoose = require("mongoose");

const StandardError = require("../errors/standardError");
const Comment = require("../models/comments");
const Post = require("../models/posts");

exports.comments_post = [
  body("username")
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage("username must be between 2 and 20 characters")
    .escape(),
  body("text")
    .trim()
    .isLength({ min: 1 })
    .withMessage("text must not be empty or undefined")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new StandardError("Validation Error", errors.array(), 400));
    }
    try {
      const post = await Post.findById(req.params.postid);
      const comment = new Comment({
        post: post._id,
        username: req.body.username,
        text: req.body.text,
      });

      await comment.save();
      return res.status(201).json({ comment });
    } catch (err) {
      if (err instanceof mongoose.Error.CastError) {
        return next(
          new StandardError("No post found with provided ID", err, 404)
        );
      } else
        return next(new StandardError("Internal database error", err, 503));
    }
  }),
];

exports.comments_delete = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.commentid);
      if (!comment) {
        return next(
          new StandardError(
            "No comment found with provided ID",
            { id: req.params.commentid },
            404
          )
        );
      }
      return res.status(200).json({ comment });
    } catch (err) {
      return next(new StandardError("Internal database error", err, 503));
    }
  }),
];
