const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const {randomBytes} = require("crypto")

// Uploads the file to cloudinary
function toCloudinary(req, res, next) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    if (req.file?.path) {
      cloudinary.uploader.upload(
        // @ts-ignore
        req.file.path,
        {
          resource_type: "raw",
          public_id:
            // @ts-ignore
            randomBytes(8).toString("hex") +
            path.extname(req.file.originalname),
        },
        (err, result) => {
          if (err) {
            return next(err);
          }
          // @ts-ignore
          fs.unlinkSync(req.file.path);
          resolve(result?.secure_url);
        }
      );
    } else {
      next()
    }
  });
}

// save the uploaded file to the database
async function fileUploadMiddleware(
  req,
  res,
  next
) {
  let fileUrl = await toCloudinary(req, res, next);
  req.file.fileUrl = fileUrl;
  next();
}

module.exports = { fileUploadMiddleware };