const catchAsync = require("../utils/catchAsync");
const Cart = require("../models/Cart");

const addToCart = catchAsync(async (req, res, next) => {
    const newCartItem = await Cart.create({
        productId: req.body.product._id,
        quantity: req.body.quantity,
        customerId: req.body.customerId,
    });
});

const getCartItems = catchAsync(async (req, res, next) => {
    
});

const deleteCartItem = catchAsync(async () => {});

const deleteAllCartItems = catchAsync(async () => {});

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem,
    deleteAllCartItems,
};
