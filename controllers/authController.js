const catchAsync = require("../utils/catchAsync");
const signToken = require("../utils/signToken");
const IndividualCustomer = require("../models/IndividualCustomer");
const BusinessCustomer = require("../models/BusinessCustomer");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

module.exports = {
    // Individual Customers
    individualCustomerSignup: catchAsync(async function (req, res, next) {
        let newCustomer = await IndividualCustomer.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumbers: [req.body.phoneNumber],
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });

        let token = signToken(newCustomer._id);

        res.status(201).json({
            status: "success",
            token,
            data: {
                user: newCustomer,
            },
        });
    }),

    individualCustomerSignin: catchAsync(async function (req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("Please provide email and password", 400));
        }

        let customer = await IndividualCustomer.findOne({ email }).select(
            "+password"
        );

        if (
            !customer ||
            !(await customer.correctPassword(password, customer.password))
        ) {
            return next(new AppError("incorrect email or password", 400));
        }

        let token = signToken(customer._id);
        res.status(200).json({
            status: "success",
            token,
            customer,
        });
    }),

    protect: catchAsync(async function (req, res, next) {
        // Getting token
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(
                new AppError(
                    "You are not logged in, please log in to gain access",
                    401
                )
            );
        }

        // Verifying token
        let decoded = await new Promise((resolve, reject) => {
            resolve(jwt.verify(token, `${process.env.JWT_SECRET}`));
        });

        // Checking if user exists
        const freshUser = await IndividualCustomer.findById(decoded.id);
        if (!freshUser) {
            return next(
                new AppError(
                    "The user belonging to the token does not exist!",
                    401
                )
            );
        }

        // Check if user changed password after the token was issued
        if (freshUser.changedPasswordAfter(decoded.iat)) {
            next(
                new AppError(
                    "Customer recently changed password, please login again!",
                    401
                )
            );
        }
        next();

        req.body.customer = freshUser;
    }),

    //Business Customers

    businessCustomerSignup: catchAsync(async function (req, res, next) {
        let newCustomer = await BusinessCustomer.create({
            businessName: req.body.businessName,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumbers: [req.body.phoneNumber],
            password: req.body.password,
            confirmPassword: req.body.confirmPassword,
        });

        let token = signToken(newCustomer._id);

        res.status(201).json({
            status: "success",
            token,
            data: {
                customer: newCustomer,
            },
        });
    }),

    businessCustomerSignin: catchAsync(async function (req, res, next) {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError("Please provide email and password", 400));
        }

        let customer = await BusinessCustomer.findOne({ email }).select(
            "+password"
        );

        if (
            !customer ||
            !(await customer.correctPassword(password, customer.password))
        ) {
            return next(new AppError("incorrect email or password", 400));
        }

        let token = signToken(customer._id);
        res.status(200).json({
            status: "success",
            token,
            customer,
        });
    }),

    protect: catchAsync(async function (req, res, next) {
        // Getting token
        let token;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return next(
                new AppError(
                    "You are not logged in, please log in to gain access",
                    401
                )
            );
        }

        // Verifying token
        let decoded = await new Promise((resolve, reject) => {
            resolve(jwt.verify(token, `${process.env.JWT_SECRET}`));
        });

        // Checking if user exists
        const freshUser = await BusinessCustomer.findById(decoded.id);
        if (!freshUser) {
            return next(
                new AppError(
                    "The user belonging to the token does not exist!",
                    401
                )
            );
        }

        // Check if user changed password after the token was issued
        if (freshUser.changedPasswordAfter(decoded.iat)) {
            next(
                new AppError(
                    "Customer recently changed password, please login again!",
                    401
                )
            );
        }
        next();

        req.body.customer = freshUser;
    }),
};
