const asyncHandler = require("express-async-handler");
const passport = require("passport");
const debug = require("debug")("blog-api:posts");

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
  asyncHandler(async (req, res, next) => {
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
  asyncHandler(async (req, res, next) => {}),
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
