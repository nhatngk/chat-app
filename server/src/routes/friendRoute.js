const router = require("express").Router();

const {searchUser, getFriendsAndRequests} = require("../controllers/friendController");
const auth = require("../middlewares/auth");

router.get("/search", auth.verifyAccessToken, searchUser);
router.get("/friends-and-requests",auth.verifyAccessToken, getFriendsAndRequests);

module.exports = router;