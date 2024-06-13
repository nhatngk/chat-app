const createError = require("http-errors");
const User = require("../models/Users");
const FriendRequest = require("../models/FriendRequests");
const ChatRoom = require("../models/ChatRooms");
const ObjectId = require("mongoose").Types.ObjectId;

exports.searchUser = async (req, res, next) => {
    try {
        const keyword = req.query.keyword;

        const users = await User
            .find({
                $text: { $search: keyword },
                _id: { $ne: req.user._id }
            })
            .select('_id username email avatar');

        res.status(200).json({
            message: "successfully",
            users
        });
    } catch (error) {
        next(error);
    }
}

exports.getFriendsAndRequests = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User
            .findById(userId)
            .select("friends")
            .populate({
                path: "friends.details",
                select: "_id username email avatar",
            })
            .exec();

        const sentRequests = await FriendRequest
            .find({ sender: userId, status: "pending" })
            .populate("sender", "_id username email avatar")
            .populate("recipient", "_id username email avatar")
            .exec();

        const receivedRequests = await FriendRequest
            .find({ recipient: userId, status: "pending" })
            .populate("sender", "_id username email avatar")
            .populate("recipient", "_id username email avatar")
            .exec();

        res.status(200).json({
            message: "Get friend requests successfully",
            friends: user.friends,
            sentRequests,
            receivedRequests,
        });

    } catch (error) {
        next(error);
    }
}

exports.createRequest = async (userId, recipientId) => {
    if (!ObjectId.isValid(userId)) throw new Error("Invalid user id");
    if (!ObjectId.isValid(recipientId)) throw new Error("Invalid recipient id");

    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    if (userId.toString() === recipientId) throw new Error("Can't add yourself as friend");
    if (user.friends.some(friend => friend.details.toString() === recipientId)) throw new Error("Already friends");

    const recipient = await User.findById(recipientId);
    if (!recipient) throw new Error("Recipient not found");

    const sentRequestExists = await FriendRequest.findOne({ sender: userId, recipient: recipientId, status: "pending" });
    const receivedRequestExists = await FriendRequest.findOne({ sender: recipientId, recipient: userId, status: "pending" });


    if (sentRequestExists || receivedRequestExists) {
        throw new Error("Request already exists");
    }

    const friendRequest = new FriendRequest({
        sender: userId,
        recipient: recipientId,
    });


    await friendRequest.save();
    const newRequest = await FriendRequest.findById(friendRequest._id)
        .populate("sender", "_id username email avatar")
        .populate("recipient", "_id username email avatar")
        .exec();
    
    return newRequest;
}

exports.cancelRequest = async (requestId) => {
    if (!ObjectId.isValid(requestId)) throw new Error("Invalid request id");

    const friendRequest = await FriendRequest.findOneAndDelete({ _id: requestId, status: "pending" });

    if (!friendRequest) {
        throw new Error("Friend request not found");
    }
    return friendRequest;
}

exports.acceptRequest = async (requestId) => {
    if (!ObjectId.isValid(requestId)) throw new Error("Invalid request id");

    const request = await FriendRequest.findOneAndUpdate(
        { _id: requestId, status: "pending" },
        { status: "accepted" },
        { new: true }
    )
    if (!request) throw new Error("Friend request not found");

    const newChatRoom = new ChatRoom({
        roomType: "private",
        members: [request.sender, request.recipient],
        name: ""
    })
    await newChatRoom.save();

    await User.findByIdAndUpdate(
        request.sender,
        {
            $push: { friends: { details: request.recipient, chatRoomId: newChatRoom._id } }
        });
    await User.findByIdAndUpdate(
        request.recipient,
        { $push: { friends: { details: request.sender, chatRoomId: newChatRoom._id } } }
    )
    const chatRoomDetails = await ChatRoom.findById(newChatRoom._id)
        .populate("members", "_id username email avatar")
        .exec();
    return {
        request,
        chatRoom: chatRoomDetails
    }
}

exports.unfriend = async (userId, friendId) => {
    if (!ObjectId.isValid(userId)) throw new Error(400, "Invalid friend id"); 
    if (!ObjectId.isValid(friendId)) throw new Error(400, "Invalid friend id"); 

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);
    user.friends = user.friends.filter(friend => friend.details.toString() !== friendId);
    friend.friends = friend.friends.filter(friend => friend.details.toString() !== user._id.toString());
    await Promise.all([user.save(), friend.save()])
}
