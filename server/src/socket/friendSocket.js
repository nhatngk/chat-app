const { createRequest, cancelRequest, acceptRequest, unfriend } = require("../controllers/friendController");
const { setNameChatRoom } = require("../controllers/chatRoomController");

exports.addRequest = (io, socket) => {
    socket.on("addRequest", async (userId, recipientId)=> {
        try {
            const newRequest = await createRequest(userId, recipientId);
            io.to(userId.toString()).emit("sentRequest", newRequest);
            io.to(recipientId.toString()).emit("receivedRequest", newRequest);
        } catch (error) {
            console.log(error);
        }
    })
}

exports.deleteRequest = (io, socket) => {
    socket.on("deleteRequest", async (userId, requestId) => {
        try {
            const request = await cancelRequest(requestId);
            const isSender = request.sender.toString() === userId.toString();
            const otherUserId = isSender ? request.recipient.toString() : request.sender.toString();

            io.to(userId.toString()).emit(isSender ? "deleteSent" : "deleteReceived", requestId);
            io.to(otherUserId).emit(isSender ? "deleteReceived" : "deleteSent", requestId);
        } catch (error) {
            console.log(error);
        }
    })
}

exports.acceptRequest = (io, socket) => {
    socket.on("acceptRequest", async (requestId) => {
        try {
            const { request, chatRoom } = await acceptRequest(requestId);
            io.to(request.sender.toString())
                .emit("acceptSent", 
                    setNameChatRoom(chatRoom, request.sender),
                    requestId
                );
            io.to(request.recipient.toString())
                .emit("acceptReceived", 
                    setNameChatRoom(chatRoom, request.recipient),
                    requestId
                );
        } catch (error) {
            console.log(error);
        }
    })
}

exports.unfriend = (io, socket) => {
    socket.on("unfriend", async (userId, friendId) => {
        await unfriend(userId, friendId);
        io.to(userId.toString()).emit("unfriend", friendId);
        io.to(friendId.toString()).emit("unfriend", userId);  
    })
}