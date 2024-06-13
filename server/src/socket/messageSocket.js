const { addMessage, addUndeliveredMessage, handleUndeliveredMembers } = require("../controllers/messageController");

exports.sendMessage = async (io, socket) => {
    socket.on("message", async (message, chatRoomId) => {
        const newMessage = await addMessage(message, chatRoomId);
        io.timeout(180000)
            .to(chatRoomId)
            .emit("message", {
                message: newMessage,
                chatRoomId,
            }, async (error, membersId) => {
                if (error) {
                    console.log(error);
                } else {
                    const messageObj = {
                        messageId: newMessage._id,
                        chatRoomId
                    }
                    await handleUndeliveredMembers({
                        io,
                        membersId,
                        ...messageObj
                    });

                    await addUndeliveredMessage({
                        undeliveredMembers: newMessage.undeliveredMembers.filter(
                            member => !membersId.includes(member.toString())
                        ),
                        ...messageObj
                    })

                }
            });
    })
}