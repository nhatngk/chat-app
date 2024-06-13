import privateApi from "./privateApi";

const friendEndpoints = {
    search: "friend/search",
    friendsAndRequests: "friend/friends-and-requests",
}
export const search = async (keyword) => {
    return await privateApi.get(`${friendEndpoints.search}?keyword=${keyword}`);
}

export const friendsAndRequests = async () => {
    return await privateApi.get(friendEndpoints.friendsAndRequests);
}
