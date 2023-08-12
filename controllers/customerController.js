const BusinessCustomer = require("../models/BusinessCustomer");
const IndividualCustomer = require("../models/IndividualCustomer");
const catchAsync = require("../utils/catchAsync");

const getTotalCount = catchAsync(async (req, res, next) => {
    const customersI = await IndividualCustomer.count();
    const customersB = await BusinessCustomer.count();

    const customersCount = customersI + customersB;

    res.status(200).json({
        status: "success",
        data: {
            customersCount,
            customersI,
            customersB,
        },
    });
});

const login = catchAsync(async (req, res, next) => {
    
});

module.exports = {
    getTotalCount,
};
