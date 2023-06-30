const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        console.error("ERROR!", err);

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error("ERROR!", err);
        res.status(500).json({
            status: "error",
            message: "something went wrong!",
        });
    }
};

const handleCastErrorDB = (err) => {
    let message = `invalid ${err.path} : ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
    let value = err.errmsg.match(/(["'])(.*?[^\\])\1/)[0];
    console.log(value);
    let message = `duplicate field value: ${value}. please use another value!`;
    return new AppError(message, 400);
};

const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `invalid input data. ${errors.join(". ")}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError("invalid token, please login again!", 401);

const handleJWTExpiredError = () => {
    new AppError("your token has expired, please login again!", 401);
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === "production") {
        let error = err;
        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.code === 11000) error = handleDuplicateFieldDB(error);
        if (error.name === "ValidationError")
            error = handleValidationError(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError();
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

        return sendErrorProd(error, res);
    }

    next();
};

module.exports = errorHandler;
