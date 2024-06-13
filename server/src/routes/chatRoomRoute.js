const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createGroupChat } = require("../controllers/chatRoomController");
const validate = require("../middlewares/validate");


router.post("/create/group",
    body("nameGroup")
        .exists().withMessage("Group name is required.")
        .notEmpty().withMessage("Group name must not be left blank."),
    validate,
    auth.verifyAccessToken, createGroupChat);


module.exports = router;