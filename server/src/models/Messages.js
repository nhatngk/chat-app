const mongoose = require("mongoose");

const callDetailsSchema = new mongoose.Schema({
    callType: {
        type: String,
        enum: ["audio", "video"],
    },
    callDuration: String,
})

const MessageSchema = new mongoose.Schema({
    messageType: {
        type: String,
        enum: ["text", "image", "video", "call", "voice", "document", "notification", "like"],
    },
    sender: mongoose.Schema.Types.ObjectId,
    readStatus: {
        type: Boolean,
        default: false,
    },
    deliveredStatus: {
        type: Boolean,
        default: false,
    },
    undeliveredMembers: [mongoose.Schema.Types.ObjectId],
    unreadMembers: [mongoose.Schema.Types.ObjectId],
    timeSent: Date,
    message: String,
    imageUrl: String,
    videoUrl: String,
    voiceNoteUrl: String,
    voiceNoteDuration: String,
    callDetails: callDetailsSchema,
});

module.exports = mongoose.model("Messages", MessageSchema);
