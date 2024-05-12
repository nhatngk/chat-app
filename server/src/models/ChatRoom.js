const mongoose = require("mongoose");

const callDetailsSchema = new mongoose.Schema({
  callType: {
    type: String,
    enum: ["audio", "video"],
  },
  callDuration: String,
})

const voiceDetailsSchema = new mongoose.Schema({
  voiceUrl: String,
  voiceDuration: String,
})

const MessageSchema = new mongoose.Schema({
  messageType: {
    type: String,
    enum: ["text", "image", "call", "voice", "document", "notification",],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  replyTo: mongoose.Schema.Types.ObjectId,
  timeSent: Date,
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
  message: String,
  imageUrl: String,
  documentUrl: String,
  callDetails: callDetailsSchema,
  voiceDetails: voiceDetailsSchema,
});

const chatRoomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    enum: ["Private", "Group"],
  },
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Users",
  },
  messageHistory: [{
    day: Number,
    messages: [MessageSchema],
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  },
  nameGroup: {
    type: String,
  },
}, {
  timestamps: true
})




module.exports = mongoose.model("ChatRooms", chatRoomSchema)  