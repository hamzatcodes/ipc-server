const Product = require("../models/Product");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Category = require("../models/Category");

const aliasTopProducts = (req, res, next) => {
    req.query.limit = "3";
    req.query.sort = "discountPrice, actualPrice";
    req.query.fields = "name, productType, actualPrice, discountPrice";
    next();
};

const getProducts = catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Product.find(), req.query)
        .filter()
        .sort()
        .paginate()
        .limit();

    let products = await features.query;
    res.status(200).json({
        status: "success",
        results: products.length,
        data: {
            products,
        },
    });
});

const getProduct = catchAsync(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(new AppError("No product found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            product,
        },
    });
});

const getProductsByCategory = catchAsync(async (req, res, next) => {
    let features = new APIFeatures(
        Product.find({ category: req.params.category }),
        req.query
    )
        .filter()
        .sort()
        .paginate()
        .limit();

    let products = await features.query;
    res.status(200).json({
        status: "success",
        results: products.length,
        data: {
            products,
        },
    });
});

// const createProduct = (urls) => {
//     console.log(urls);
//     return async (req, res, next) => {
        
//     };
// };

const updateProduct = catchAsync(async (req, res, next) => {
    let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        return next(new AppError("No product found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            product,
        },
    });
});

const deleteProduct = catchAsync(async (req, res, next) => {
    let product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return next(new AppError("No product found with that ID", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

const getAllProductsByCategory = catchAsync(async (req, res) => {
    const products = await Category.aggregate([
        {
            $lookup: {
                from: "products",
                localField: "name",
                foreignField: "category",
                as: "products",
            },
        },
    ]);

    if (products) {
        return res.status(200).json({
            status: "success",
            count: products.length,
            data: products,
        });
    }
});

// const deleteAllProducts = async (req, res, next) => {
//     try {
//         await Product.delet();
//         res.status(204).json({
//             status: "success",
//             data: null,
//         });
//     } catch (err) {
//         res.status(400).json({
//             status: "fail",
//             message: err,
//         });
//     }
// };

// const getProductStats = catchAsync(
//     async (req, res, next) => {
//         let stats = await Product.aggregate([
//             {
//                 $match: { discountPrice: { $gte: 299 } },
//             },
//             {
//                 $group: {
//                     _id: "$productType",
//                     productCount: { $sum: 1 },
//                     totalPrice: { $sum: "$discountPrice" },
//                     avgPrice: { $avg: "$discountPrice" },
//                     minPrice: { $min: "$discountPrice" },
//                     maxPrice: { $max: "$discountPrice" },
//                 },
//             },
//             {
//                 $sort: { avgPrice: 1 },
//             },
//         ]);

//         res.status(200).json({
//             status: "success",
//             data: {
//                 stats,
//             },
//         });
//     }
// );

// const getMonthlyPlan = catchAsync(
//     async (req, res, next) => {
//         let year = Number(req.params.year);
//         // let plan = await Product.aggregate([]);
//         res.status(200).json({
//             status: "success",
//             data: {
//                 plan: year,
//             },
//         });
//         console.log(year);
//     }
// );

module.exports = {
    getProducts,
    // createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    aliasTopProducts,
    getAllProductsByCategory,
    getProductsByCategory,
    // getProductStats,
    // getMonthlyPlan,
    // deleteAllProducts,
};
