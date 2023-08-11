const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
    {
        streetAddress: { type: String, required: [true, "Street is required"] },
        directions: { type: String },
        state: { type: String, required: [true, "State is required"] },
        // zipcode: { type: String, required: [true, "Zipcode is required"] },
        lga: { type: String, required: [true, "LGA is required"] },
        customerId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Customer",
            required: [true, "Customer ID is required"],
        },
    },
    { timeStamps: true }
);

const Address = mongoose.model("Address", addressSchema);
