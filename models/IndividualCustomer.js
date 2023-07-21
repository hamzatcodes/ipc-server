const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// const phoneNumberSchema = mongoose.Schema({
//     number: {
//         type: String,
//     },
// });

const individualCustomerSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "first name is required"],
        },
        lastName: {
            type: String,
            required: [true, "last name is required"],
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
            default: "INDIVIDUAL",
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
        addresses: {
            type: [String],
        },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTime: Date,
    },
    {
        timestamps: true,
    }
);

individualCustomerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

individualCustomerSchema.methods.correctPassword = async function (
    candidatePassword,
    customerPassword
) {
    return await bcrypt.compare(candidatePassword, customerPassword);
};

individualCustomerSchema.methods.changedPasswordAfter = async function (
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

individualCustomerSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.passwordResetTime = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const IndividualCustomer = mongoose.model(
    "IndividualCustomer",
    individualCustomerSchema
);

module.exports = IndividualCustomer;
