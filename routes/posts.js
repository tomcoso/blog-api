const express = require("express");
const router = express.Router();

const asyncHandler = require("express-async-handler");
const posts_controller = require("../controllers/postController");
const comments_controller = require("../controllers/commentsController");

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

router.get("/", posts_controller.posts_all_get);

router.get("/:postid", posts_controller.posts_one_get);

router.post("/", posts_controller.posts_post);

router.put("/:postid", posts_controller.posts_update);

router.delete("/:postid", posts_controller.posts_delete);

// comments

router.post("/:postid", comments_controller.comments_post);

router.delete(
  "/:postid/comments/:commentid",
  comments_controller.comments_delete
);

module.exports = router;
