const router = require("express").Router();

const userRoute = require("./userRoute");
const friendRoute = require("./friendRoute");
const chatRoomRoute = require("./chatRoomRoute");

router.use("/user", userRoute);
router.use("/friend", friendRoute);
router.use("/chat", chatRoomRoute);

module.exports = router;