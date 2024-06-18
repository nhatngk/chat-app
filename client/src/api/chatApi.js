import privateApi from "./privateApi";

const chatApiEndpoints = {
    getAllMessages: "chat/",
}
export const getAllMessages = async (chatRoomId) => {
    return await privateApi.get(`${chatApiEndpoints.getAllMessages}${chatRoomId}`);
}

