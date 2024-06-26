const ChatRoom = require("../models/ChatRooms");
const Message = require("../models/Messages");
const User = require("../models/Users");
exports.addMessage = async (message, chatRoomId) => {
    const newMessage = new Message({
        ...message,
        timeSent: new Date(),
    });
    const chatRoom = await ChatRoom.findById(chatRoomId);
    newMessage.undeliveredMembers = chatRoom.members.filter(
        member => member.toString() !== newMessage.sender.toString()
    );
    newMessage.unreadMembers = newMessage.undeliveredMembers;
    chatRoom.messageHistory.push(newMessage._id);
    await Promise.all([newMessage.save(), chatRoom.save()]);
    for (let member of newMessage.unreadMembers) {
        await User.findByIdAndUpdate(member, {
            $push: {
                "unreadMessages": {
                    chatRoomId,
                    messageId: newMessage._id
                }
            }
        })
    }
    const newMessageObj = await Message.findById(newMessage._id)
    .populate("sender", "_id username avatar")
    .exec();
    return newMessageObj;
}

module.exports.addUndeliveredMessage = async ({ undeliveredMembers, messageId, chatRoomId }) => {
    for (let member of undeliveredMembers) {
        await User.findByIdAndUpdate(member, {
            $push: {
                "undeliveredMessages": {
                    chatRoomId,
                    messageId
                }
            }
        })
    }
}

exports.handleUndeliveredMembers = async ({ io, membersId, messageId, chatRoomId }) => {
    const message = await Message.findById(messageId);
    message.undeliveredMembers = message.undeliveredMembers.filter(
        memberId => !membersId.includes(memberId.toString())
    );
    message.deliveredStatus = !message.undeliveredMembers.length;
    await message.save();
    if (message.deliveredStatus) {
        io.to(chatRoomId).emit("user:messageDelivered", {
            messageId,
            chatRoomId,
        });
    }
}

exports.handleUnreadMembers = async ({ io, membersId, messageId, chatRoomId }) => {
    const message = await Message.findById(messageId);
    message.unread = message.unreadMembers.filter(
        memberId => !membersId.includes(memberId.toString())
    );
    message.readStatus = !message.unreadMembers.length;
    await message.save();
    if (message.readStatus) {
        io.to(chatRoomId).emit("user:messageRead", {
            messageId,
            chatRoomId,
        });
    }
}
