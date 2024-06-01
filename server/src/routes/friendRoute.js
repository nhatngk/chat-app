const router = require("express").Router();

const friendController = require("../controllers/friendController");
const auth = require("../middlewares/auth");

router.get("/search", auth.verifyAccessToken, friendController.searchUser);
router.post("/sent-friend-request/:id",auth.verifyAccessToken, friendController.sentFriendRequest);
router.get("/friends-and-requests",auth.verifyAccessToken, friendController.getFriendsAndRequests);
router.delete("/cancel-friend-request/:id",auth.verifyAccessToken, friendController.cancelFriendRequest);
router.post("/reject-friend-request/:id",auth.verifyAccessToken, friendController.rejectFriendRequest);
router.post("/accept-friend-request/:id",auth.verifyAccessToken, friendController.acceptFriendRequest);
router.post("/unfriend/:id",auth.verifyAccessToken, friendController.unfriend);


module.exports = router;