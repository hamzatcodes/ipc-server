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
            default: true,
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
            type: [Object],
            required: [true, "images are required"],
        },
        slug: {
            type: String,
        },
        category: { type: String, ref: "Category", required: [true, "Category is required"] },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
