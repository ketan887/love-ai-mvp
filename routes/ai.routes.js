const express = require("express");
const { getAIAdvice } = require("../controllers/ai.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/advice", auth, getAIAdvice); // 👈 protect route

module.exports = router;
