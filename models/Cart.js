const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    productId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "Product ID is required"],
        ref: "Product",
    },
    product: {
        type: Object,
        required: [true, "Product ID is required"],
    },
    quantity: {
        type: Number,
        default: 1,
    },
    customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: [true, "Customer ID is required"],
        ref: "BusinessCustomer",
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required"],
    },
});

cartSchema.pre("save", function (next) {
    this.totalPrice = this.product.discountPrice;
    next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
