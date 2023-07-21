const IndividualCustomer = require("../models/IndividualCustomer");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");

const getCustomers = catchAsync(async () => {
    let features = new APIFeatures(IndividualCustomer.find(), req.query)
        .filter()
        .sort()
        .paginate()
        .limit();

    let customers = await features.query;
    res.status(200).json({
        status: "success",
        results: customers.length,
        data: {
            customers,
        },
    });
});

const getCustomer = catchAsync(async (req, res, next) => {
    let customer = await IndividualCustomer.findById(req.params.id);

    if (!customer) {
        return next(new AppError("No customer found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            customer,
        },
    });
});

const updateCustomer = catchAsync(async (req, res, next) => {
    let customer = await IndividualCustomer.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!customer) {
        return next(new AppError("No customer found with that ID", 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            customer,
        },
    });
});

const deleteCustomer = catchAsync(async (req, res, next) => {
    let customer = await IndividualCustomer.findByIdAndDelete(req.params.id);

    if (!customer) {
        return next(new AppError("No customer found with that ID", 404));
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
});

module.exports = {
    getCustomers,
    getCustomer,
    updateCustomer,
    deleteCustomer,
};
