const {  handleUpload } = require("../config/cloudinary");

exports.upload = async (req, res, next) => {
    try {
        const file = req.file;
        
        const cldRes = await handleUpload(file);
        return res.status(200).json({ 
            message: "File uploaded successfully",
            url: cldRes.secure_url
         });
    } catch (error) {
        next(error);
    }
}