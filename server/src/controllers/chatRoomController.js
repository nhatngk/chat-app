const createError = require("http-errors");
const ChatRoom = require("../models/ChatRooms");
const ObjectId = require("mongoose").Types.ObjectId;

exports.getAllChatRoom = async (req, res, next) => {
    try {
       
        const chatRooms = await ChatRoom
    } catch (error) {
        next(error);
    }
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

exports.setNameChatRoom = (chatRoom, userId) => {
    chatRoom.name = chatRoom.members.find(member => member._id.toString() !== userId.toString()).username;
    return chatRoom;
}