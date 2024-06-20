const cloudinary = require('cloudinary').v2;
const secret = require("../config/env");

cloudinary.config({
    cloud_name: secret.cloudinary_name,
    api_key: secret.cloudinary_api_key,
    api_secret: secret.cloudinary_api_secret
  });


module.exports = cloudinary;  