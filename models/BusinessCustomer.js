const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const businessCustomerSchema = mongoose.Schema(
    {
        businessName: {
            type: String,
            required: [true, "business name is required"],
        },
        firstName: {
            type: String,
            required: [true, "first name is required"],
        },
        lastName: {
            type: String,
            required: [true, "first name is required"],
        },
        phoneNumbers: {
            type: [String],
            required: [true, "Phone number is required"],
        },
        email: {
            type: String,
            required: [true, "email address is required"],
            lowercase: true,
            unique: true,
            validate: [validator.isEmail, "please provide a valid email"],
        },
        referral: {
            type: String,
        },
        type: {
            type: String,
            default: "BUSINESS",
        },
        password: {
            type: String,
            required: [true, "password is required"],
            minLength: [8, "must have at least 8 characters"],
            select: false,
        },
        confirmPassword: {
            type: String,
            required: [true, "confirm password is required"],
            minLength: [8, "must have at least 8 characters"],
            select: false,
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: "Passwords do not match!",
            },
        },
        verified: {
            type: Boolean,
            default: false,
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTime: Date,
    },
    {
        timestamps: true,
    }
);

businessCustomerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

businessCustomerSchema.methods.correctPassword = async function (
    candidatePassword,
    customerPassword
) {
    return await bcrypt.compare(candidatePassword, customerPassword);
};

businessCustomerSchema.methods.changedPasswordAfter = async function (
    JWTTimestamp
) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            `${this.passwordChangedAt.getTime() / 1000}`,
            10
        );
        console.log(this.passwordChangedAt, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

businessCustomerSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetTime = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

businessCustomerSchema.methods.checkVerification = function () {
    if (this.verified) {
        return true;
    } else {
        return false;
    }
};

const BusinessCustomer = mongoose.model(
    "BusinessCustomer",
    businessCustomerSchema
);

module.exports = BusinessCustomer;
