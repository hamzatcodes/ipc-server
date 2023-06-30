// import { Request, Response, NextFunction } from "express";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
// import { Media } from "../models";
import path from "path";
import { randomBytes } from "crypto";

// Uploads the file to cloudinary
function toCloudinary(req, res, next) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  return new Promise((resolve, reject) => {
    let newImg = []
    if(req.files){
        // Object.keys(req.files).map((item) => {
        //     console.log(item)
        // })
        const files = req.files;

        Object.keys(files).forEach(file => {
            console.log(file, files[file].map(item => item.path))
        })

        // for (let file in files) {
        //     console.log(file, files[file].map(item => item.path));


            
            // if (file) {
            //     cloudinary.uploader.upload(
            //       // @ts-ignore
            //       path,
            //       {
            //         resource_type: "raw",
            //         public_id:
            //           // @ts-ignore
            //           randomBytes(8).toString("hex") +
            //           path.extname(file.originalname),
            //       },
            //       (err, result) => {
            //         if (err) {
            //           return next(err);
            //         }
            //         // @ts-ignore
            //         fs.unlinkSync(file.path);
            //         resolve(result?.secure_url);
            //       }
            //     );
            //   } else {
            //     next()
            //   }
        // }

        // for (const file of files) {

            // console.log(file)
            // if (file) {
            //     cloudinary.uploader.upload(
            //       // @ts-ignore
            //       path,
            //       {
            //         resource_type: "raw",
            //         public_id:
            //           // @ts-ignore
            //           randomBytes(8).toString("hex") +
            //           path.extname(originalname),
            //       },
            //       (err, result) => {
            //         if (err) {
            //           return next(err);
            //         }
            //         // @ts-ignore
            //         fs.unlinkSync(path);
            //         resolve(result?.secure_url);
            //       }
            //     );
            //   } else {
            //     next()
            //   }
        // }
    }
  });
}

// save the uploaded file to the database
async function uploadMultiple(
  req,
  res,
  next
) {
  let fileUrl = await toCloudinary(req, res, next);
//   req.files.fileUrl = 
  fileUrl;
  next();
}

export { uploadMultiple };
