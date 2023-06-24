import axios, {AxiosRequestConfig, AxiosResponse,AxiosRequestHeaders} from 'axios'
import Storage from "../storage/Storage"
const axiosClient=axios.create({
    baseURL:"http://localhost:5000/api/v1",
    headers:{
        'Content-Type':"application/json",
        'Access-Control-Allow-Origin': '*'
    }
})
const Repository=(type:string,url:string,payload?:any)=>{
    const { params, body } = payload;

    switch (type) {
        case "GET":
            return axiosClient.get(url, { params: params?params:{} })
        case "POST":
            return axiosClient.post(url,body)
        case "PUT":
            return axiosClient.put(url,body)
        case "DELETE":
            return axiosClient.delete(url,{params:params})
    }
}
// Add a request interceptor
axiosClient.interceptors.request.use(function (config:AxiosRequestConfig) {
    const token = Storage.GetLocalStorage('user');
    console.log(token)
    const headers: AxiosRequestHeaders = {
        Authorization: `${token}`
    };
    if (token) config.headers = { ...config.headers, ...headers };

    // Do something before request is sent
    return config;
}, function (error:any) {
    // Do something with request error
    return Promise.reject(error)
})
// Add a response interceptor
axiosClient.interceptors.response.use(function (response:AxiosResponse) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
}, function (error:any) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
});
export default Repository
