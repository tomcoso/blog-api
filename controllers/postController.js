const asyncHandler = require("express-async-handler");

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

exports.posts_post = asyncHandler(async (req, res, next) => {
  try {
    const post = new Post({
      author: req.body.admin._id,
      title: req.body.title,
      text: req.body.text,
      status: "unpublished",
    });
    await post.save();
    res.json({ post });
  } catch (err) {
    console.error(err);
    res.sendStatus(400);
    return;
  }
});

exports.posts_update = asyncHandler(async (req, res, next) => {});

exports.posts_delete = asyncHandler(async (req, res, next) => {});
