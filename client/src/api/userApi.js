import publicApi from "./publicApi";

const userEndpoints = {
    signUp: "user/sign-up",
    signIn: "user/sign-in",
    signOut: "user/sign-out",
    refresh: "user/refresh"
}

const userApi = {
    signUp: async(userData) => {
        return await publicApi.post(userEndpoints.signUp, userData);
    },

    signIn: async(credentials) => {
        return await publicApi.post(userEndpoints.signIn, credentials);
    },

    signOut: async() => {
        return await publicApi.post(userEndpoints.signOut);
    },
    refresh: async () =>{
        return await publicApi.post(userEndpoints.signOut);
    },
}
export default userApi;