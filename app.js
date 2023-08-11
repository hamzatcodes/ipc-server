const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const BusinessCustomerRouter = require(`${__dirname}/routes/businessCustomerRoutes`);
const AppError = require(`${__dirname}/utils/appError`);
const individualCustomerRouter = require(`${__dirname}/routes/individualCustomerRoutes`);
const errorHandler = require(`${__dirname}/controllers/errorController`);
const productRouter = require(`${__dirname}/routes/productRoutes`);
const blogRouter = require(`${__dirname}/routes/blogRoutes`);
const categoryRouter = require(`${__dirname}/routes/categoryRoutes`);
const customerRouter = require(`${__dirname}/routes/customerRoutes`);
const cartRouter = require(`${__dirname}/routes/cartRoutes`);
const paystackRouter = require(`${__dirname}/routes/paystackRoutes`);
const orderRouter = require(`${__dirname}/routes/orderRoutes`);

// Instantiate express app
const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

console.log(process.env.PORT, "port");

// Body parser
app.use(express.json());

// Enablng CORS
app.use(cors());
app.options("*", cors());

// Default route
app.get("/", (req, res) => {
    res.end("Hello from IPC");
});

// Routes
app.use("/api/v1/individual-customers", individualCustomerRouter);
app.use("/api/v1/business-customers", BusinessCustomerRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/customers", customerRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/paystack", paystackRouter);
app.use("/api/v1/orders", orderRouter);

// Catch all error route
app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

// Error handler
app.use(errorHandler);

module.exports = app;
