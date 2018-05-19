const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Post = require("../../models/post");

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
      user: req.body.user
    });
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
