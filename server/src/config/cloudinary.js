const cloudinary = require('cloudinary').v2;
const sharp = require('sharp');
const secret = require("./env");

cloudinary.config({
  cloud_name: secret.cloudinary_name,
  api_key: secret.cloudinary_api_key,
  api_secret: secret.cloudinary_api_secret
});

exports.handleUpload = async (file) => {
  try {
    let resourceType = "raw";
    let dataURI = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    if (file.mimetype.startsWith("image/")) {
      const processedImage = await sharp(file.buffer)
        .jpeg()
        .toBuffer();  

      dataURI = `data:image/jpeg;base64,${processedImage.toString('base64')}`;
      resourceType = "image";
    } else if (file.mimetype.startsWith("video/")) {
      resourceType = "video";
    }
    
    const res = await cloudinary.uploader.upload(dataURI, {
      folder: "chat-app",
      resource_type: resourceType,
    });

    return res;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error);
    throw error;
  }
}
