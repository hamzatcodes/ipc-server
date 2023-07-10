const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    image: {
        type: String,
        required: [true, "Image is required"],
    },
    customerId: {
        type: mongoose.SchemaTypes.ObjectId,
        // ref: "Customer",
    },
    phoneNumber: {
        type: String,
        required: [true, "Phone Number is required"],
    },
    address: {
        type: String,
        required: [true, "Address is required"],
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
    },
    status: {
        type: String,
        default: "PENDING",
    },
    quantity: {
        type: number,
        minlength: 1,
    },
});
