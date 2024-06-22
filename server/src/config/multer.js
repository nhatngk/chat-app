const multer = require("multer");
exports.multer = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024,
        files: 1,
    },
});