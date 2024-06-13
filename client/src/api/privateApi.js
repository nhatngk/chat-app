import axios from "axios";
import { refreshToken } from "./userApi";
const privateApi = axios.create({
    baseURL: 'http://localhost:5000/api/',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

privateApi.interceptors.response.use(
    response => response?.data,
    async error => {
        const originalRequest = error.config;

        if (error?.response?.data?.statusCode === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            return refreshToken()
                .then(() =>  privateApi(originalRequest))
                .catch(error => Promise.reject(error))
        }

        return Promise.reject(error?.response ? error?.response?.data : { message: "Fail to connnect" });

    });

export default privateApi;
