import axios from "axios";

const publicApi = axios.create({
    baseURL: 'http://localhost:5000/api/',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

publicApi.interceptors.response.use(
    response => response?.data,
    error => Promise.reject(error?.response ? error?.response?.data :  { message: "Fail to connnect" })
)
export default publicApi;
