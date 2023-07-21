const multer = require("multer");
const path = require("path");
const AppError = require("./appError");
const { createBrotliCompress } = require("zlib");

// Multer config
// const upload = multer({
//     storage: multer.diskStorage({}),
//     fileFilter: (req, file, cb) => {
//         let ext = path.extname(file.originalname);
//         if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".svg") {
//             cb(new AppError("File type is not supported"), false);
//             return;
//         }
//         cb(null, true);
//     },
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/svg"
    ) {
        cb(null, true);
    } else {
        cb({ message: "Unsupported File Format" }, false);
    }
};

const upload = multer({
    storage,
    // limits: { fileSize: 1024 * 1024 },
    fileFilter,
});

module.exports = upload;
