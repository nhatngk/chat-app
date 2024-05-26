const createError = require("http-errors");
const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const ObjectId = require("mongoose").Types.ObjectId;

const getFriendRequests = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const sentRequest = await FriendRequest.find({ sender: userId, status: "pending" });
        const receivedRequest = await FriendRequest.find({ recipient: userId, status: "pending" });
        res.status(200).json({ sentRequest, receivedRequest });
    } catch (error) {
        next(error);
    }
}

const sentFriendRequest = async (req, res, next) => {
    try {
        const user = req.user;
        const recipientId = req.params.id;
        if(!ObjectId.isValid(recipientId)) throw createError(400, "Invalid recipient id");

        if (user._id.toString() === recipientId) throw createError(400, "You can't add yourself as a friend");
        if (user.friends.some(friend => friend.friendId.toString() === recipientId)) throw createError(400, "Already friends");

        const recipient = await User.findById(recipientId);
        if (!recipient) throw createError(404, "User not found");

        const sentRequestExists = await FriendRequest.findOne({ sender: user._id, recipient: recipientId, status: "pending" });
        const receivedRequestExists = await FriendRequest.findOne({ sender: recipientId, recipient: user._id, status: "pending" });


        if (sentRequestExists || receivedRequestExists) {
            throw createError(400, "Friend request already sent or received");
        }

        const friendRequest = new FriendRequest({
            sender: user._id,
            recipient: recipientId,
        });

        await friendRequest.save();

        res.status(200).json({ message: "Friend request sent successfully" });

    } catch (error) {
        next(error);
    }
}

const cancelFriendRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;

        if (!ObjectId.isValid(requestId)) throw createError(400, "Invalid friend request id");

        const friendRequest = await FriendRequest.findOneAndDelete({ _id: requestId, status: "pending" });

        if (!friendRequest) {
            throw createError(404, "Friend request not found");
        }

        res.status(200).json({ message: "Cancelled friend request successfully" });

    } catch (error) {
        next(error);
    }
}


const acceptFriendRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;

        if (!ObjectId.isValid(requestId)) throw createError(400, "Invalid friend request id");

        const friendRequest = await FriendRequest.findByIdAndUpdate(requestId, { status: "accepted" }, { new: true });
        if (!friendRequest) throw createError(404, "Friend request not found");

        const senderUpdate = User.findByIdAndUpdate(
            friendRequest.sender,
            { $push: { friends: { friendId: friendRequest.recipient } } },
            { new: true, runValidators: true }
        );

        const recipientUpdate = User.findByIdAndUpdate(
            friendRequest.recipient,
            { $push: { friends: { friendId: friendRequest.sender } } },
            { new: true, runValidators: true }
        );

        await Promise.all([senderUpdate, recipientUpdate]);

        res.status(200).json({ message: "Friend request accepted successfully" });
    } catch (error) {
        next(error);
    }
}

const rejectFriendRequest = async (req, res, next) => {
    try {
        const requestId = req.params.id;

        if (!ObjectId.isValid(requestId)) throw createError(400, "Invalid friend request id");

        const friendRequest = await FriendRequest.findOneAndUpdate(
            { _id: requestId, status: "pending" },
            { status: "rejected" },
            { new: true }
        );
        if (!friendRequest) throw createError(404, "Friend request not found");

        res.status(200).json({ message: "Friend request rejected successfully" });

    } catch (error) {
        next(error);
    }
}

const unfriend = async (req, res, next) => {
    try {
        const user = req.user;
        const friendId = req.params.id;
        if (!ObjectId.isValid(friendId)) throw createError(400, "Invalid friend id");
        

        if (!user.friends.some(friend => friend.friendId.toString() === friendId)) throw createError(400, "Not friends");

        const friend = await User.findById(friendId);
        user.friends = user.friends.filter(friend => friend.friendId.toString() !== friendId);
        friend.friends = friend.friends.filter(friend => friend.friendId.toString() !== user._id.toString());

        await user.save();
        await friend.save();

        res.status(200).json({ message: "Unfriended successfully" });
      
    } catch (error) {
        next(error);
    }
}


module.exports = {
    sentFriendRequest,
    sentFriendRequest,
    cancelFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriendRequests,
    unfriend
}