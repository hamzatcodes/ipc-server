const Order = require("../models/Order");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

const getOrders = catchAsync(async (req, res, next) => {
    let features = new APIFeatures(Order.find(), req.query)
        .filter()
        .sort()
        .paginate()
        .limit();

    let orders = await features.query;
    res.status(200).json({
        status: "success",
        results: orders.length,
        data: {
            orders,
        },
    });
});

const createOrder = catchAsync(async (req, res, next) => {
    let newOrder = await Order.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        products: [req.body.products],
        customerId: req.body.customerId,
        phoneNumbers: req.body.phoneNumbers,
        address: req.body.address,
        paymentMethod: req.body.paymentMethod,
        status: req.body.status,
    });

    res.status(201).json({
        status: "success",
        data: {
            order: newOrder,
        },
    });
});

const getOrder = catchAsync(async (req, res, next) => {});
const updateOrder = catchAsync(async (req, res, next) => {
    let order = await Order.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!order) {
        return next(new AppError("No order found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            order,
        },
    });
});

// const getCustomerOrders = catchAsync(async(req, res, next) => {
//     const orders = BusinessCustomer.find()
// })

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    updateOrder,
};
