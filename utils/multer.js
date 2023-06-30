const multer = require("multer");
const path = require("path");
const AppError = require("./appError");

// Multer config
const upload = multer({
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".svg") {
            cb(new AppError("File type is not supported"), false);
            return;
        }
        cb(null, true);
    },
});

module.exports = upload;
