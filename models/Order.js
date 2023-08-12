const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"],
    },
    products: {
        type: Array,
        required: [true, "Products are required"],
    },
    customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Customer",
        required: [true, "Customer ID is required"],
    },
    phoneNumbers: {
        type: [String],
        required: [true, "Phone Number is required"],
    },
    address: {
        type: Object,
        required: [true, "Address is required"],
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment Method is required"],
    },
    totalPrice: {
        type: Number,
        required: [true, "Total Price is required"]
    },
    status: {
        type: String,
        default: "PENDING",
        enum: ["PENDING", "CONFIRMED", "DELIVERED"],
    },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
