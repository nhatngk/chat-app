const router = require("express").Router();
const auth = require("../middlewares/auth");
const { upload } = require("../controllers/cloudianryController");
const { multer } = require("../config/multer");


router.post("/", multer.single("file"), auth.verifyAccessToken, upload);

module.exports = router;