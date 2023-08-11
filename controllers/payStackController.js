const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const payStackApi = require("../utils/paystackApi");

const initializePayment = catchAsync(async (req, res) => {
    const { amount, email, callbackUrl, name } = req.body;

    const paymentDetails = {
        amount,
        email,
        callbackUrl,
        metadata: {
            amount,
            email,
            name,
        },
    };

    const data = await payStackApi.initialize(paymentDetails);
    return res
        .status(200)
        .json({ message: "Payment initialized successfully", data });
});

const verifyPayment = catchAsync(async (req, res, next) => {
    if (!req.query.reference) {
        next(new AppError("Missing Transaction Reference", 400));
    }

    const {
        data: {
            metadata: { email, amount, name },
            reference,
            status: transactionStatus,
        },
    } = await payStackApi.verifyPayment(req.query.reference);

    if (transactionStatus !== "success") {
        next(new AppError(`Transaction: ${transactionStatus}`, 400));
    }
});

module.exports = {
    initializePayment,
    verifyPayment,
};
