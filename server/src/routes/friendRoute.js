const router = require("express").Router();
const { body } = require("express-validator")
const validate = require("../middlewares/validate");

const friendController = require("../controllers/friendController");
const auth = require("../middlewares/auth");

router.post("/sent-friend-request/:id",auth.verifyAccessToken, friendController.sentFriendRequest);
router.get("/get-friend-requests",auth.verifyAccessToken, friendController.getFriendRequests);
router.delete("/cancel-friend-request/:id",auth.verifyAccessToken, friendController.cancelFriendRequest);
router.post("/reject-friend-request/:id",auth.verifyAccessToken, friendController.rejectFriendRequest);
router.post("/accept-friend-request/:id",auth.verifyAccessToken, friendController.acceptFriendRequest);
router.post("/unfriend/:id",auth.verifyAccessToken, friendController.unfriend);


module.exports = router;