const createError = require("http-errors");
const ChatRoom = require("../models/ChatRoom");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

const createPrivateChat = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) throw createError(400, "Invalid id");

        const user = req.user;
        if (!user.friends.some(friend => friend.details.toString() === id))
            throw createError(400, "Must be friend");

        const isExist = await ChatRoom.findOne({
            roomType: "Private",
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

const createGroupChat = async (req, res, next) => {
    try {
        const { members } = req.body;
        if (members.some(member => !ObjectId.isValid(member))) throw createError(400, "Invalid id");

        const user = req.user;

        members.forEach(member => {
            if (!user.friends.some(friend => friend.details.toString() === member))
                throw createError(400, "Must be friend");
        })

        const chatRoom = new ChatRoom({
            type: "Group",
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

const getAllChatRoom = async (req, res, next) => {
    try {
        const user = req.user;

        const chats = await ChatRoom.aggregate([
            
        ])

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createPrivateChat,
    createGroupChat,
    getAllChatRoom
}