const express = require("express");
const { body } = require("express-validator");
const { register, login, profile } = require("../controllers/auth.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Min 6 chars password")
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required")
  ],
  login
);

router.get("/profile", auth, profile);

module.exports = router;
