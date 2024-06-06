const User = require("../models/User");

exports.getSocketDetails = async (userId) => {
    userModel = await User.findById(userId);
  
    allRoomsUserIn = userModel.chatRooms.map((room) => room.toString());
  
    return { userModel, allRoomsUserIn };
  };
   