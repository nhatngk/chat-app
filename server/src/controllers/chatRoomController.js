const createError = require("http-errors");
const ObjectId = require("mongoose").Types.ObjectId;
const ChatRoom = require("../models/ChatRooms");
const Message = require("../models/Messages");
const User = require("../models/Users");

exports.setNameChatRoom = (chatRoom, userId) => {
    if (chatRoom.roomType === 'private')
        chatRoom.name = chatRoom.members.find(member => member._id.toString() !== userId.toString()).username;
    return chatRoom;
}

exports.getSocketDetails = async (userId) => {
    if (!ObjectId.isValid(userId)) throw new Error("Invalid userId");
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const allRooms = user?.chatRooms.map((room) => room.toString());
    return {
        user,
        allRooms
    };
};

exports.getAllMessages = async (req, res, next) => {
    try {
        const chatRoomId = req.params.id;
        if (!ObjectId.isValid(chatRoomId)) throw createError(400, "Invalid chat room id");

        const chatRoom = await ChatRoom.findById(chatRoomId)
            .populate({
                path: "messageHistory",
                populate: {
                    path: "sender"
                }
            })
            .exec();
        if (!chatRoom) throw createError(404, "Chat room not found");
        return res.status(200).json({
            messages: chatRoom.messageHistory
        });

    } catch (error) {
        next(error)
    }
}

exports.getAllChatRooms = async (chatRooms, userId) => {
    if (!chatRooms.length) return [];

    const chatRoomsDetailsPromises = chatRooms.map(async (chatRoom) => {
        let chatRoomDetails = await ChatRoom.findById(chatRoom)
            .populate("members", "_id username email avatar status")
            .exec();
        chatRoomDetails = chatRoomDetails.toObject();
        chatRoomDetails = this.setNameChatRoom(chatRoomDetails, userId);

        const latestMessageId = chatRoomDetails.messageHistory.length && chatRoomDetails.messageHistory[chatRoomDetails.messageHistory.length - 1];
        if (latestMessageId) {
            chatRoomDetails.latestMessage = await Message.findById(latestMessageId)
                .populate("sender", "_id username email avatar status")
                .exec();
        }
        const { messageHistory, ...rest } = chatRoomDetails;
        return rest;
    })

    const chatRoomsDetails = await Promise.all(chatRoomsDetailsPromises);

    chatRoomsDetails.sort((a, b) => {
        if (!a.latestMessage && !b.latestMessage) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (!a.latestMessage) return 1;
        if (!b.latestMessage) return -1;
        return new Date(b.latestMessage.timeSent) - new Date(a.latestMessage.timeSent);
    });

    return chatRoomsDetails;
}

exports.createPrivateChat = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) throw createError(400, "Invalid id");

        const user = req.user;
        if (!user.friends.some(friend => friend.details.toString() === id))
            throw createError(400, "Must be friend");

        const isExist = await ChatRoom.findOne({
            roomType: "orivate",
            members: { $all: [userId1, userId2] },
            $expr: { $eq: [{ $size: "$members" }, 2] }
        });
        if (isExist) throw createError(400, "Already exists");

        const chatRoom = new ChatRoom({
            type: "Private",
            members: [user._id, id]
        });
        await chatRoom.save();
        res.status(201).json({ chatRoom });

    } catch (error) {
        next(error);
    }
}

exports.createGroupChat = async (req, res, next) => {
    try {
        const { members } = req.body;
        if (members.some(member => !ObjectId.isValid(member))) throw createError(400, "Invalid id");

        const user = req.user;

        members.forEach(member => {
            if (!user.friends.some(friend => friend.details.toString() === member))
                throw createError(400, "Must be friend");
        })

        const chatRoom = new ChatRoom({
            type: "group",
            members: [user._id, ...members],
            nameGroup: req.body.nameGroup,
            owner: user._id,
            admin: [user._id],
        });
        await chatRoom.save();
        res.status(201).json({ chatRoom });

    } catch (error) {
        next(error);
    }
}
