const multer = require("multer");
const { Router } = require("express");
const {
    createPost,
    createCategory,
    getCategories,
    getPosts,
    getPost,
} = require("../controllers/postController");
// const { fileUploadMiddleware } = require("../utils/fileUploadMiddleware");
// const { uploadMultiple } = require("../utils/uploadMultiple");
const upload = multer({ dest: "./temp" }).single("photo");

const router = Router();

router.route("/").get(getPosts).post(createPost);
router.route("/:id").get(getPost);
router.route("/category").get(getCategories).post(createCategory);

module.exports = router;
