import privateApi from "./privateApi";

const friendEndpoints = {
    search: "friend/search",
    friendsAndRequests: "friend/friends-and-requests",
    addFriend: "friend/sent-friend-request/",
    cancelRequest: "friend/cancel-friend-request/",
    acceptRequest: "friend/accept-friend-request/",
    rejectRequest: "friend/reject-friend-request/",
    unfriend: "friend/unfriend/",

}
export const search = async (keyword) => {
    return await privateApi.get(`${friendEndpoints.search}?keyword=${keyword}`);
}

export const friendsAndRequests = async () => {
    return await privateApi.get(friendEndpoints.friendsAndRequests);
}

export const addFriend = async (id) => {
    return await privateApi.post(`${friendEndpoints.addFriend}${id}`);
}

export const cancelRequest = async (id) => {
    return await privateApi.delete(`${friendEndpoints.cancelRequest}${id}`);
}

export const rejectRequest = async (id) => {
    return await privateApi.post(`${friendEndpoints.rejectRequest}${id}`);
}

export const acceptRequest = async (id) => {
    return await privateApi.post(`${friendEndpoints.acceptRequest}${id}`);
}

export const unfriend = async (id) => {
    return await privateApi.post(`${friendEndpoints.unfriend}${id}`);
}

