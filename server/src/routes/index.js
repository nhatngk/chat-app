const router = require("express").Router();

const userRoute = require("./userRoute");
const friendRoute = require("./friendRoute");

router.use("/user", userRoute);
router.use("/friend", friendRoute);

module.exports = router;