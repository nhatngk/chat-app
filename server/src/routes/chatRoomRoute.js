const router = require("express").Router();
const auth = require("../middlewares/auth");
const chatRoomController = require("../controllers/chatRoomController");
const validate = require("../middlewares/validate");


router.post("/create/private/:id", auth.verifyAccessToken, chatRoomController.createPrivateChat);
router.post("/create/group",
    body("nameGroup")
        .exists().withMessage("Group name is required.")
        .notEmpty().withMessage("Group name must not be left blank."),
    validate,
    auth.verifyAccessToken, chatRoomController.createGroupChat);


module.exports = router;