const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    productId: {
        type: String,
        required: [true, "Product ID is required"],
    },
    quantity: {
        type: Number,
        default: 1,
    },
    customerId: {
        type: String,
        required: [true, "Customer ID is required"],
    },
});

const Cart = mongoose.model("Cart", cartSchema);
