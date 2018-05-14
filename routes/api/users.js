const express = require("express");
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests user route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

module.exports = router;
