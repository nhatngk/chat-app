const mongoose = require("mongoose");

const callDetailsSchema = new mongoose.Schema({
    callType: {
        type: String,
        enum: ["audio", "video"],
    },
    callDuration: String,
})

const documentDetailsSchema = new mongoose.Schema({
    documentName: String,
    documentUrl: String,
    documentType: String,
    documentSize: String,
})

const MessageSchema = new mongoose.Schema({
    messageType: {
        type: String,
        enum: ["text", "image", "video", "call", "voice", "document", "notification", "like"],
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
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
    documentDetails: documentDetailsSchema,
    callDetails: callDetailsSchema,
});

module.exports = mongoose.model("Messages", MessageSchema);
