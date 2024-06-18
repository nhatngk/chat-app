const { handleUndeliveredMembers } = require("../controllers/messageController");
const { getSocketDetails, getAllChatRooms } = require("../controllers/chatRoomController");

exports.onlineController = (io, socket) => {
  socket.on("online", async (userId) => {
    try {
      socket.userId = userId;
      const { user, allRooms } = await getSocketDetails(userId);
      socket.join(userId.toString());
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

      const chatRooms = await getAllChatRooms(allRooms, userId);
      socket.to(allRooms).emit("online", userId);
      socket.emit("chatRooms", chatRooms);
    } catch (error) {
      socket.emit("error", {
        message: error.message,
      });
    }
  })
}

exports.disconnecting = async (io, socket) => {
  socket.on("disconnecting", async () => {
    try {
      const userId = socket.userId;
      const { user, allRooms } = await getSocketDetails(userId);
      const time = new Date(Date.now());
      user.status = {
        online: false,
        lastSeen: time
      };
      await user.save();
      socket.to(allRooms).emit("offline", userId, time);
      socket.leave(allRooms);
    } catch (error) {
    }
  })
} 