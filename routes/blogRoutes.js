const multer = require("multer");
const { Router } = require("express");
const { createPost, createCategory, getCategories } = require("../controllers/postController");
// const { fileUploadMiddleware } = require("../utils/fileUploadMiddleware");
// const { uploadMultiple } = require("../utils/uploadMultiple");
const upload = multer({ dest: "./temp" }).single("photo");

const router = Router();

router.route("/").post(createPost);
router.route("/category").get(getCategories).post(createCategory);

module.exports = router;
