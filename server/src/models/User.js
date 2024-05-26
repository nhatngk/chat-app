const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const createError = require("http-errors");
const crypto = require("crypto");

const friendSchema = new mongoose.Schema({
    friendId: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    chatRoomId: mongoose.Schema.Types.ObjectId,
})

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
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg"
    },
    verifyToken: String,
    verifyTokenExpires: Date,
    forgotPasswordToken: String,
    forgotPasswordTokenExpires: Date,
    verified: {
        type: Boolean,
        default: false
    },
    status: {
        online: { type: Boolean, default: false },
        lastSeen: Date,
    },
    chatRooms: [mongoose.Schema.Types.ObjectId],
    unreadMessages: [{}],
    undeliveredMessages: [{}],
    friends: [friendSchema],
    //expired if not verified within 7 days
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

userSchema.methods.hashPassword = async function (password = this.password) {
    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        this.password = await bcrypt.hash(password, salt);
    } catch (err) {
        throw createError(500, { message: err });
    }
}

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        throw createError(500, { message: err });
    }
}

userSchema.methods.generateVerifyToken = async function () {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15);

    this.verifyToken = await crypto.randomBytes(32).toString("hex");
    this.verifyTokenExpires = expirationDate;

    return this.verifyToken;
};

userSchema.methods.generateForgotPasswordToken = async function () {
    const expirationDate = new Date();
    expirationDate.setMinutes(expirationDate.getMinutes() + 15);
    this.forgotPasswordToken = await crypto.randomBytes(32).toString("hex");
    this.forgotPasswordTokenExpires = expirationDate;
    return this.forgotPasswordToken;
}



module.exports = mongoose.model("Users", userSchema)  