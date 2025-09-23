// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/auth");
// const { getGiftIdeas, getGiftHistory } = require("../controllers/gift.controller");

// router.post("/", auth, getGiftIdeas);
// router.get("/history", auth, getGiftHistory);

// module.exports = router;



// const express = require("express");
// const router = express.Router();
// const giftController = require("../controllers/gift.controller");
// const auth = require("../middleware/auth"); // your JWT middleware


// // Routes
// // Routes with authentication
// router.post("/", auth, giftController.getGiftIdeas);       // generate gift ideas
// router.get("/history", auth, giftController.getGiftHistory); // fetch gift history

// module.exports = router;



const express = require("express");
const router = express.Router();
const giftController = require("../controllers/gift.controller");

router.post("/", giftController.getGiftIdeas); // generate AI gift ideas

module.exports = router;
