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
