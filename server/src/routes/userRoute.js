const router = require("express").Router();
const { body } = require("express-validator")
const validate = require("../middlewares/validate");

const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.post(
    "/sign-up",
    body("email")
        .exists().withMessage("Email is required.")
        .notEmpty().withMessage("Email must not be left blank.")
        .isEmail().withMessage("Invalid email format."),
    body("username")
        .exists().withMessage("Username is required.")
        .isLength({ min: 6 }).withMessage("Username must have at least 6 characters."),
    body("password")
        .exists().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must have at least 6 characters."),
    validate,
    userController.signUp
);

router.post("/verify", userController.verifyEmail);

router.post("/sign-in",
    body("email")
        .exists().withMessage("Email is required.")
        .notEmpty().withMessage("Email must not be left blank.")
        .isEmail().withMessage("Invalid email format."),
    body("password")
        .exists().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must have at least 6 characters."),
    validate,
    userController.signIn);

router.delete("/sign-out",auth.verifyAccessToken, userController.signOut);
router.post("/change-password",auth.verifyAccessToken, userController.changePassword);
router.post("/refresh", auth.verifyRefreshToken, userController.refreshToken);
router.post("/forget-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.get("/me", auth.verifyAccessToken ,userController.getMe);

module.exports = router;