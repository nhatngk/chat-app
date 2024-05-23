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

router.delete("/sign-out", auth.verifyAccessToken, userController.signOut);

router.post("/change-password",
    auth.verifyAccessToken,
    body("password")
        .exists().withMessage("Password is required.")
        .isLength({ min: 6 }).withMessage("Password must have at least 6 characters."),
    body("newPassword")
        .exists().withMessage("New password is required.")
        .isLength({ min: 6 }).withMessage("Password must have at least 6 characters."),
    validate,
    userController.changePassword);

router.get("/me", auth.verifyAccessToken, userController.getMe);

router.post("/refresh", auth.verifyRefreshToken, userController.refreshToken);

router.post("/update-profile", auth.verifyAccessToken, userController.updateProfile);

router.post("/verify", auth.verifyAccessToken, userController.verifyEmail);

router.post("/confirm-email/:token", userController.confirmEmail);

router.post("/forgot-password",
    body("email")
        .exists().withMessage("Email is required.")
        .notEmpty().withMessage("Email must not be left blank.")
        .isEmail().withMessage("Invalid email format."),
    validate,
        userController.forgotPassword);

router.post("/reset-password/:token",
    body("newPassword")
        .exists().withMessage("New password is required.")
        .isLength({ min: 6 }).withMessage("Password must have at least 6 characters."),
    validate,
    userController.resetPassword);


module.exports = router;