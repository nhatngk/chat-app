const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createGroupChat, getAllMessages } = require("../controllers/chatRoomController");
const validate = require("../middlewares/validate");
const { body } = require("express-validator");

router.get("/:id", auth.verifyAccessToken, getAllMessages);

router.post("/create/group",
    body("nameGroup")
        .exists().withMessage("Group name is required.")
        .notEmpty().withMessage("Group name must not be left blank."),
    validate,
    auth.verifyAccessToken, createGroupChat);


module.exports = router;