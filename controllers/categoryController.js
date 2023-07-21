const Category = require("../models/Category");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

const getCategories = catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Category.find(), req.query).filter().sort();

    let categories = await features.query;
    res.status(200).json({
        status: "success",
        results: categories.length,
        data: {
            categories,
        },
    });
});

module.exports = {
    getCategories,
};
