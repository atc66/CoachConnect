const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

// Validator
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route   GET api/posts
// @desc    get posts
// @access  Public route

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: "No posts found" }));
});

// @route   GET api/posts/:id
// @desc    get posts
// @access  Public route

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: "No post found with that ID" })
    );
});

// @route   POST api/posts
// @desc    Create post route
// @access  Private route

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //   check Validation
    if (!isValid) {
      // If erros return erros object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    console.log(req.user.id);
    console.log(req.body.name);
    console.log(req.body.text);
    console.log(req.body.avatar);

    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post route
// @access  Private route

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check for owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({
              notauthorized: "User not authorized to delete this post"
            });
          }
          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// router.delete(
//   "/:id",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     console.log(req.params.id);
//     console.log(req.user.id);
//     Post.findById(req.params.id)
//       .then(post => {
//         //if post does not exist
//         if (!post) {
//           return res.status(404).json({ nopostfound: "No Post found" });
//           //if a logged user try to delete another user's post
//         } else if (post.user.toString() !== req.user.id) {
//           return res.status(401).json({
//             unauthorized: "You are not authorized to perform this action"
//           });
//         } else {
//           post
//             .remove()
//             .then(() => res.json({ success: true }))
//             .catch(err => res.status(400).json(err));
//         }
//       })
//       //if ObjectID is not a valid Object ID
//       .catch(err =>
//         res.status(400).json({ invalidPostId: "This post ID is invalid" })
//       );
//   }
// );

module.exports = router;
