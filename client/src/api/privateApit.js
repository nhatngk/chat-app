import axios from "axios";

const privateApi = axios.create({
    baseURL: 'http://localhost:5000/api/',
    timeout: 5000,
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
})

privateApi.interceptors.response.use(
    response => response.data,
    error => {
        const { config, response } = error;
        if (response && response.status === 401) {
            
            return axios(config); 
        }
        return Promise.reject(error.response ? error.response.data : "Fail to connnect");
    });

export default privateApi;
