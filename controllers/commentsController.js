const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

const Comment = require("../models/comments");

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
      return res.status(400).json({ errors: errors.array() });
    }

    const comment = new Comment({
      post: req.params.postid,
      username: req.body.username,
      text: req.body.text,
    });

    await comment.save();
    return res.status(201).json({ comment });
  }),
];

exports.comments_delete = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    const comment = await Comment.findByIdAndDelete(req.params.commentid);
    return res.status(200).json({ comment });
  }),
];
