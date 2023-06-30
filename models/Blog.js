const mongoose = require("mongoose");
const slugify = require("slugify")

const blogCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

blogCategorySchema.pre("save", function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

const blogPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        cover: {
            type: String,
            default: "no-photo",
        },
        snippet: {
            type: String,
            required: true,
        },
        contents: {
            type: Array,
            required: [true, "Contents are required"],
        },
        headlines: {
            type: Array,
            required: [true, "Headlines are required"],
        },
        conclusion: {
            type: Object,
            required: [true, "conclusion is required"],
        },
        category: {
            type: String,
            required: [true, "category is required"],
            ref: "Category",
        },
        slug: {
            type: String,
        },
        profile: {
            type: Object,
            required: [true, "Profile is required"],
        },
    },
    {
        timestamps: true,
    }
);

blogPostSchema.pre("save", function (next) {
    this.slug =
        slugify(this.postTitle, { lower: true }) + "-" + new Date().getTime();
    next();
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);

module.exports = { BlogPost, BlogCategory };
