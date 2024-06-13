const User = require("../models/Users");
const { handleUndeliveredMembers } = require("../controllers/messageController");

exports.getSocketDetails = async (userId) => {
  if(!userId) throw new Error("Invalid userId");
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  allRooms = user?.chatRooms.map((room) => room.toString());
  return {
    user,
    allRooms
  };
};

exports.onlineController = (io, socket) => {
  socket.on("online", async (userId) => {
    try {
      socket.userId = userId;
      socket.join(userId.toString());
      const { user, allRooms } = await this.getSocketDetails(userId);
      socket.join(allRooms);
      user.status = {
        online: true,
        lastSeen: undefined,
      };
  
      for (let message of user.undeliveredMessages) {
        await handleUndeliveredMembers({
          io,
          membersId: [userId],
          ...message
        });
      }
  
      user.undeliveredMessages = [];
      await user.save();
      socket.to(allRooms).emit("online", userId);
    } catch (error) {
      console.log(error);
    }
  })
}

exports.disconnected = async(io, socket) => {
  socket.on("disconnecting", async () => {
    const userId = socket.userId;
    const { user, allRooms } = await this.getSocketDetails(userId);
    const time = new Date(Date.now()).toISOString();
    user.status = {
      online: false,
      lastSeen: time
    };
    await user.save(); 
    socket.to(allRooms).emit("offline", userId);
  })
} 