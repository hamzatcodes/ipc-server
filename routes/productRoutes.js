const { Router } = require("express");
const {
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getAllProductsByCategory,
    getProductsByCategory,
    getTotalCount,
} = require("../controllers/productController");
const Product = require("../models/Product");
const upload = require("../utils/multer");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const catchAsync = require("../utils/catchAsync");

const router = Router();

router.get("/all-products-by-category/:category", getAllProductsByCategory);
router.get("/product-by-category/:category", getProductsByCategory);
router.route("/total-product-count").get(getTotalCount);

router
    .route("/")
    .get(
        // authController.protect || authController.protect2,
        getProducts
    )
    .post(
        upload.array("image", 4),
        catchAsync(async (req, res, next) => {
            const uploader = async (path) =>
                await cloudinary.uploads(path, "Images");
            if (req.method === "POST") {
                const urls = [];
                const files = req.files;
                const newUrls = [];

                for (const file of files) {
                    const { path } = file;
                    const newPath = await uploader(path);
                    urls.push(newPath);
                    fs.unlinkSync(path);
                }
                // return require("../controllers/productController").createProduct(
                //     urls
                // );

                let newProduct = await Product.create({
                    images: [...urls],
                    name: req.body.name,
                    description: req.body.description,
                    actualPrice: req.body.actualPrice,
                    discountPrice: req.body.discountPrice,
                    // inStock: req.body.inStock,
                    brand: req.body.brand,
                    weight: req.body.weight,
                    category: req.body.category,
                });

                res.status(201).json({
                    status: "success",
                    data: {
                        product: newProduct,
                    },
                });
            } else {
                next(new AppError("Error uploading images", 405));
            }
        })
    );
router.route("/:id").get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
