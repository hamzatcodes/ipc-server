const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, "description is required"],
            trim: true,
        },
        actualPrice: {
            type: Number,
            required: [true, "actual price is required"],
        },
        discountPrice: {
            type: Number,
            required: [true, "discount price is required"],
            validate: function (val) {
                return this.actualPrice > val;
            },
        },
        inStock: {
            type: Boolean,
            default: [true],
        },
        quantity: {
            type: Number,
            // required: [true, "quantity is required"],
        },
        brand: {
            type: String,
            required: [true, "brand is required"],
            trim: true,
        },
        weight: {
            type: Number,
        },
        images: {
            type: [String],
            required: [true, "images are required"],
        },
        variants: {
            type: [String],
        },
        sku: {
            type: Number,
        },
        slug: {
            type: String,
        },
        productType: {
            type: String,
            required: [true, "product type is required"],
            trim: true,
        },
        category: { type: mongoose.Types.ObjectId, ref: "Category" },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
