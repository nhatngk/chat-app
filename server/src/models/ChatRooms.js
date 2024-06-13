const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  roomType: {
    type: String,
    enum: ["private", "group"],
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  }],
  messageHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  admin: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users"
  }],
  name: {
    type: String,
    
  },
}, {
  timestamps: true
})



module.exports = mongoose.model("ChatRooms", chatRoomSchema)  