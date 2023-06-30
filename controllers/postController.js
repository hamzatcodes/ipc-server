const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const { BlogPost, BlogCategory } = require("../models/Blog");

const getPosts = catchAsync(async (req, res, next) => {
    let features = new APIFeatures(BlogPost.find(), req.query)
        .filter()
        .sort()
        .paginate()
        .limit();

    let posts = await features.query;
    res.status(200).json({
        status: "success",
        results: posts.length,
        data: {
            posts,
        },
    });
});

const getPost = catchAsync(async (req, res, next) => {
    let post = await BlogPost.findById(req.params.id);

    if (!post) {
        return next(new AppError("No post found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            post,
        },
    });
});

const createPost = catchAsync(async (req, res, next) => {
    let newPost = await BlogPost.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            post: newPost,
        },
    });
});

const getCategories = catchAsync(async (req, res, next) => {
    let categories = await BlogCategory.find();

    res.status(200).json({
        status: "success",
        results: categories.length,
        data: {
            categories,
        },
    });
});

const createCategory = catchAsync(async (req, res, next) => {
    console.log(req.body);
    let newCategory = await BlogCategory.create(req.body);
    res.status(201).json({
        status: "success",
        data: {
            category: newCategory,
        },
    });
});

// const updateProduct = catchAsync(async (req, res, next) => {
//     let product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//         new: true,
//         runValidators: true,
//     });

//     if (!product) {
//         return next(new AppError("No product found with that ID", 404));
//     }

//     res.status(200).json({
//         status: "success",
//         data: {
//             product,
//         },
//     });
// });

// const deleteProduct = catchAsync(async (req, res, next) => {
//     let product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//         return next(new AppError("No product found with that ID", 404));
//     }

//     res.status(204).json({
//         status: "success",
//         data: null,
//     });
// });

// const getProductStats = catchAsync(async (req, res, next) => {
//     let stats = await Product.aggregate([
//         {
//             $match: { discountPrice: { $gte: 299 } },
//         },
//         {
//             $group: {
//                 _id: "$productType",
//                 productCount: { $sum: 1 },
//                 totalPrice: { $sum: "$discountPrice" },
//                 avgPrice: { $avg: "$discountPrice" },
//                 minPrice: { $min: "$discountPrice" },
//                 maxPrice: { $max: "$discountPrice" },
//             },
//         },
//         {
//             $sort: { avgPrice: 1 },
//         },
//     ]);

//     res.status(200).json({
//         status: "success",
//         data: {
//             stats,
//         },
//     });
// });

module.exports = {
    getPosts,
    getPost,
    createPost,
    createCategory,
    getCategories
};
