const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const Post = require("../models/posts");
const Comment = require("../models/comments");
const Admin = require("../models/admins");

/* GET home page. */

router.use(
  "/",
  asyncHandler(async (req, res, next) => {
    const admin = await Admin.findOne({});
    req.body.admin = admin;
    next();
  })
);

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const posts = await Post.find({}).sort({ timestamp: -1 }).exec();
    res.json({ data: posts });
  })
);

router.get(
  "/:postid",
  asyncHandler(async (req, res, next) => {
    const [post, comments] = await Promise.all([
      Post.findById(req.params.postid),
      Comment.find({ post: req.params.postid }).exec(),
    ]);

    res.json({ data: { post: post, comments } });
  })
);

router.post(
  "/",
  asyncHandler(async (req, res, next) => {
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
  })
);

module.exports = router;
