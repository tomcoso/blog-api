const asyncHandler = require("express-async-handler");
const passport = require("passport");
const debug = require("debug")("blog-api:posts");
const { body, validationResult } = require("express-validator");

const Post = require("../models/posts");
const Comment = require("../models/comments");
const Admin = require("../models/admins");

exports.posts_all_get = asyncHandler(async (req, res, next) => {
  const posts = await Post.find({}).sort({ timestamp: -1 }).exec();
  res.json({ data: posts });
});

exports.posts_one_get = asyncHandler(async (req, res, next) => {
  const [post, comments] = await Promise.all([
    Post.findById(req.params.postid),
    Comment.find({ post: req.params.postid }).exec(),
  ]);

  res.json({ data: { post: post, comments } });
});

exports.posts_post = [
  passport.authenticate("jwt", { session: false }),
  body("title")
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage("title must be between 10 and 100 characters")
    .escape(),
  body("text")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("text must be between 10 and 2000 characters")
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const post = new Post({
        author: req.body.admin._id,
        title: req.body.title,
        text: req.body.text,
        status: "unpublished",
      });
      await post.save();
      return res.json({ post });
    } catch (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  }),
];

exports.posts_update = [
  passport.authenticate("jwt", { session: false }),
  body("key")
    .custom((value) => {
      return ["title", "text", "status"].includes(value);
    })
    .withMessage("Only accept keys: 'title', 'text', 'status'.")
    .escape(),
  body("update")
    .custom((value, { req }) => {
      if (req.body.key !== "status") return true;
      return value === "published" || value === "unpublished";
    })
    .withMessage("status must be either 'published' or 'unpublished'")
    .custom((value, { req }) => {
      if (
        req.body.key === "title" &&
        (value.length < 10 || value.length > 100)
      ) {
        throw new Error("title must be between 10 and 100 characters");
      } else if (
        req.body.key === "text" &&
        (value.length < 10 || value.length > 2000)
      ) {
        throw new Error("text must be between 10 and 2000 characters");
      } else if (
        req.body.key === "status" &&
        value !== "published" &&
        value !== "unpublished"
      ) {
        throw new Error("status must be either 'published' or 'unpublished'");
      }
      return true;
    })
    .escape(),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findByIdAndUpdate(
      req.params.postid,
      {
        [req.body.key]: req.body.update,
      },
      { new: true }
    );

    if (post === null) {
      return res.status(400).json({ message: "post does not exist" });
    }

    return res.status(200).json({ post });
  }),
];

exports.posts_delete = [
  passport.authenticate("jwt", { session: false }),
  asyncHandler(async (req, res, next) => {
    try {
      const post = await Post.findByIdAndDelete(req.params.postid);
      debug(post);
      const count = await Comment.deleteMany({ post: post._id });
      return res
        .status(200)
        .json({ post, comments_deleted: count.deletedCount });
    } catch (err) {
      return res.sendStatus(400);
    }
  }),
];
