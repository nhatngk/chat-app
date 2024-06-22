const router = require("express").Router();

const userRoute = require("./userRoute");
const friendRoute = require("./friendRoute");
const chatRoomRoute = require("./chatRoomRoute");
const cloudinaryRoute = require("./cloudinaryRoute");

router.use("/user", userRoute);
router.use("/friend", friendRoute);
router.use("/chat", chatRoomRoute);
router.use("/upload", cloudinaryRoute);

module.exports = router;