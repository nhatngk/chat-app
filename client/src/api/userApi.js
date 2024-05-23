import publicApi from "./publicApi";
import privateApi from "./privateApi";

const userEndpoints = {
    signUp: "user/sign-up",
    signIn: "user/sign-in",
    signOut: "user/sign-out",
    refreshToken: "user/refresh",
    forgotPassword: "user/forgot-password",
    resetPassword: "user/reset-password",
    changePassword: "user/change-password",
    verify: "user/verify",
    confirmEmail: "user/confirm-email",
    getMe: "user/me"
}

export const signUp = async (credentials) => {
    return await publicApi.post(userEndpoints.signUp, credentials);
}
export const signIn = async (credentials) => {
    return await publicApi.post(userEndpoints.signIn, credentials);
}

export const signOut = async () => {
    return await privateApi.delete(userEndpoints.signOut);
}

export const forgotPassword = async (credentials) => {
    return await publicApi.post(userEndpoints.forgotPassword, credentials);
}

export const resetPassword = async (token, credentials) => {
    return await publicApi.post(`${userEndpoints.resetPassword}/${token}`, credentials);
}

export const changePassword = async (credentials) => {
    return await privateApi.post(userEndpoints.changePassword, credentials);
}

export const verify = async () => {
    return await publicApi.post(userEndpoints.verify);
}

export const confirmEmail = async (token) => {
    return await publicApi.post(`${userEndpoints.confirmEmail}/${token}`);
}

export const refreshToken = async () => {
    return await publicApi.post(userEndpoints.refreshToken);
}
export const getMe = async () => {
    return await privateApi.get(userEndpoints.getMe);
}
