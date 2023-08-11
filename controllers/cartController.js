const catchAsync = require("../utils/catchAsync");
const Cart = require("../models/Cart");

const addToCart = catchAsync(async (req, res, next) => {
    const cartItem = await Cart.findOne({ productId: req.body.productId });
    if (cartItem) {
        const update = await Cart.findOneAndUpdate(
            { productId: req.body.productId },
            {
                $set: {
                    quantity: cartItem.quantity + 1,
                    totalPrice:
                        cartItem.totalPrice + cartItem.product.discountPrice,
                },
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            status: "success",
            data: {
                message: "Product Added successfully",
                cartItem: update,
            },
        });
    } else {
        const newCartItem = await Cart.create({
            productId: req.body.productId,
            product: req.body.product,
            customerId: req.body.customerId,
            totalPrice: req.body.product.discountPrice,
        });
        res.status(200).json({
            status: "success",
            data: {
                message: "Product Added successfully",
                cartItem: newCartItem,
            },
        });
    }
});

const getCartItems = catchAsync(async (req, res, next) => {
    const cartItems = await Cart.find({ customerId: req.body.customerId });

    const aggregate = await Cart.aggregate([
        {
            $group: {
                _id: req.body.customerId,
                totalPrice: { $sum: "$totalPrice" },
                count: { $sum: 1 },
            },
        },
    ]);

    res.status(200).json({ 
        status: "success",
        data: {
            totalPrice: aggregate,
            cartItems,
        },
    });
});

const deleteCartItem = catchAsync(async (req, res, next) => {
    const cartItem = await Cart.findOne({ productId: req.params.id });
    console.log(cartItem);
    if (cartItem.quantity > 1) {
        await Cart.findOneAndUpdate(
            { productId: req.body.productId },
            {
                $set: {
                    quantity: cartItem.quantity - 1,
                    totalPrice:
                        cartItem.totalPrice - cartItem.product.discountPrice,
                },
            },
            { new: true, runValidators: true }
        );

        res.status(204).json({
            status: "success",
            data: null,
        });
    } else {
        let item = await Cart.findOneAndDelete({
            productId: req.body.productId,
        });
        if (!item) {
            return next(new AppError("No Cart Item found with that ID", 404));
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    }
});

const deleteAllCartItems = catchAsync(async (req, res, next) => {
    await Cart.deleteMany();
    res.status(204).json({
        status: "success",
        data: null,
    });
});

module.exports = {
    addToCart,
    getCartItems,
    deleteCartItem,
    deleteAllCartItems,
};
