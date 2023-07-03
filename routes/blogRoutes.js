const multer = require("multer");
const { Router } = require("express");
const { createPost, createCategory, getCategories, getPosts } = require("../controllers/postController");
// const { fileUploadMiddleware } = require("../utils/fileUploadMiddleware");
// const { uploadMultiple } = require("../utils/uploadMultiple");
const upload = multer({ dest: "./temp" }).single("photo");

const router = Router();

router.route("/").post(createPost).get(getPosts);
router.route("/category").get(getCategories).post(createCategory);

module.exports = router;
