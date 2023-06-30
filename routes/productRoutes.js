const { Router } = require("express");
const {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProductsByCategory,
    getProductsByCategory,
} = require("../controllers/productController");
const multer = require("multer");
const { fileUploadMiddleware } = require("../utils/fileUploadMiddleware");

const upload = multer({ dest: "./temp" }).single("photo");

const router = Router();

router.get("/all-products-by-category/:category", getAllProductsByCategory);
router.get("/product-by-category/:category", getProductsByCategory);

router
    .route("/")
    .get(
        // authController.protect || authController.protect2,
        getProducts
    )
    .post(upload, fileUploadMiddleware , createProduct);
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
