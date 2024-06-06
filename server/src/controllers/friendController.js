const createError = require("http-errors");
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const ChatRoom = require("../models/ChatRoom");
const ObjectId = require("mongoose").Types.ObjectId;

const searchUser = async (req, res, next) => {
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

const getFriendsAndRequests = async (req, res, next) => {
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

const sentFriendRequest = async (req, res, next) => {
    try {
        const user = req.user;
        const userId = user._id;
        const recipientId = req.params.id;
        if (!ObjectId.isValid(recipientId)) throw createError(400, "Invalid recipient id");

        if (userId.toString() === recipientId) throw createError(400, "You can't add yourself as a friend");
        if (user.friends.some(friend => friend.details.toString() === recipientId)) throw createError(400, "Already friends");

        const recipient = await User.findById(recipientId);
        if (!recipient) throw createError(404, "User not found");

        const sentRequestExists = await FriendRequest.findOne({ sender: userId, recipient: recipientId, status: "pending" });
        const receivedRequestExists = await FriendRequest.findOne({ sender: recipientId, recipient: userId, status: "pending" });


        if (sentRequestExists || receivedRequestExists) {
            throw createError(400, "Friend request already sent or received");
        }

        const friendRequest = new FriendRequest({
            sender: userId,
            recipient: recipientId,
        });

        await friendRequest.save();

        const sentRequests = await FriendRequest
            .find({ sender: userId, status: "pending" })
            .populate("sender", "_id username email avatar")
            .populate("recipient", "_id username email avatar")
            .exec();

        res.status(200).json({
            message: "Friend request sent successfully",
            sentRequests
        });

    } catch (error) {
        next(error);
    }
}

const cancelFriendRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const userId = req.user._id;

        if (!ObjectId.isValid(requestId)) throw createError(400, "Invalid friend request id");

        const friendRequest = await FriendRequest.findOneAndDelete({ _id: requestId, status: "pending" });

        if (!friendRequest) {
            throw createError(404, "Friend request not found");
        }

        const sentRequests = await FriendRequest
            .find({ sender: userId, status: "pending" })
            .populate("sender", "_id username email avatar")
            .populate("recipient", "_id username email avatar")
            .exec();

        res.status(200).json({
            message: "Cancelled friend request successfully",
            sentRequests
        });

    } catch (error) {
        next(error);
    }
}


const acceptFriendRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const userId = req.user._id;

        if (!ObjectId.isValid(requestId)) throw createError(400, "Invalid friend request id");

        const friendRequest = await FriendRequest.findOneAndUpdate(
            { _id: requestId, recipient: userId, status: "pending" },
            { status: "accepted" },
            { new: true });
        if (!friendRequest) throw createError(404, "Friend request not found");

        const chatRoom = new ChatRoom({
            type: "Private",
            members: [friendRequest.sender, friendRequest.recipient],
        })

        const senderUpdate = User.findByIdAndUpdate(
            friendRequest.sender,
            {
                $push: {
                    friends: {
                        details: friendRequest.recipient,
                        chatRoom: chatRoom._id
                    },
                    chatRooms: chatRoom._id
                }
            },
            { new: true, runValidators: true }
        );

        const recipientUpdate = User.findByIdAndUpdate(
            friendRequest.recipient,
            {
                $push: {
                    friends: {
                        details: friendRequest.sender,
                        chatRoom: chatRoom._id
                    },
                    chatRooms: chatRoom._id
                }
            },
            { new: true, runValidators: true }
        );

        await Promise.all([chatRoom.save(), senderUpdate, recipientUpdate]);

        const user = await User
            .findById(userId)
            .select("friends")
            .populate({
                path: "friends.details",
                select: "_id username email avatar",
            })
            .exec();

        const receivedRequests = await FriendRequest
            .find({ recipient: userId, status: "pending" })
            .populate("sender", "_id username email avatar")
            .populate("recipient", "_id username email avatar")
            .exec();

        res.status(200).json({
            message: "Friend request accepted successfully",
            friends: user.friends,
            chatRoom,
            receivedRequests
        });
    } catch (error) {
        next(error);
    }
}

const rejectFriendRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;
        const userId = req.user._id;

        if (!ObjectId.isValid(requestId)) throw createError(400, "Invalid friend request id");

        const friendRequest = await FriendRequest.findOneAndUpdate(
            { _id: requestId, status: "pending" },
            { status: "rejected" },
            { new: true }
        );
        if (!friendRequest) throw createError(404, "Friend request not found");

        const receivedRequests = await FriendRequest
            .find({ recipient: userId, status: "pending" })
            .populate("sender", "_id username email avatar")
            .populate("recipient", "_id username email avatar")
            .exec();

        res.status(200).json({
            message: "Friend request rejected successfully",
            receivedRequests
        });

    } catch (error) {
        next(error);
    }
}

const unfriend = async (req, res, next) => {
    try {
        const user = req.user;
        const friendId = req.params.id;
        if (!ObjectId.isValid(friendId)) throw createError(400, "Invalid friend id");


        if (!user.friends.some(friend => friend.details.toString() === friendId)) throw createError(400, "Not friends");

        const friend = await User.findById(friendId);
        user.friends = user.friends.filter(friend => friend.details.toString() !== friendId);
        friend.friends = friend.friends.filter(friend => friend.details.toString() !== user._id.toString());

        await user.save();
        await friend.save();

        const newUser = await User
            .findById(user._id)
            .select("friends")
            .populate({
                path: "friends.details",
                select: "_id username email avatar",
            })
            .exec();


        res.status(200).json({
            message: "Unfriended successfully",
            friends: newUser.friends
        });

    } catch (error) {
        next(error);
    }
}


module.exports = {
    searchUser,
    sentFriendRequest,
    sentFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendsAndRequests,
    unfriend
}