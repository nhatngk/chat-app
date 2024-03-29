const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const createError = require("http-errors");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: ""
    },
    verifyToken: String,
    verifyTokenExpires: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpires: Date,
    verified: {
        type: Boolean,
        default: false
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: {
            expireAfterSeconds: 7 * 86400,
            partialFilterExpression: { verified: false }
        }
    }
}, {
    timestamps: true
})

userSchema.methods.hashPassword = async function () {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(this.password, salt);
    } catch (err) {
        throw createError(500, { message: err });
    }
}

userSchema.methods.comparePassword = async function (password) {
    try {
        return bcrypt.compare(password, this.password);
    } catch (err) {
        throw createError(500, { message: err });
    }
}

userSchema.methods.generateVerifyToken = async function () {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15);

    this.verifyToken = crypto.randomBytes(32).toString("hex");
    this.verifyTokenExpires = expirationDate;

    return this.verifyToken;
};



module.exports = mongoose.model("Users", userSchema)  