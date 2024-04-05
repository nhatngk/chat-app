import publicApi from "./publicApi";
import privateApi from "./privateApi";

const userEndpoints = {
    signUp: "user/sign-up",
    signIn: "user/sign-in",
    signOut: "user/sign-out",
    refreshToken: "user/refresh",
    getMe: "user/me"
}

export const signUp = async (credentials) => {
    return await publicApi.post(userEndpoints.signUp, credentials);
}
export const signIn = async (credentials) => {
    return await publicApi.post(userEndpoints.signIn, credentials);
}

export const signOut = async () => {
    return await publicApi.post(userEndpoints.signOut);
}

export const refreshToken = async () => {
    return await publicApi.post(userEndpoints.refreshToken);
}
export const getMe = async () => {
    return await privateApi.get(userEndpoints.getMe);
}
