const mongoose = require("mongoose");

const FriendRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    recipient : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    status: {
        type: String,
        enum: ["pending", "accepted"],
        default: "pending",
    },
});

module.exports = mongoose.model("FriendRequests", FriendRequestSchema);