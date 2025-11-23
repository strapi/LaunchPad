import axios from "axios";
import { message } from 'ant-design-vue';

// 设置 post 请求头
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";
// 在跨域请求时，不会携带用户凭证；返回的 response 里也会忽略 cookie
axios.defaults.withCredentials = false;

console.log("环境变量", import.meta.env);
// 创建 axios 实例, 请求超时时间为 10 秒 baseURL: import.meta.env.BASE_URL,

const isDev = import.meta.env.MODE === 'development';

const instance = axios.create({
  baseURL: isDev ? undefined : import.meta.env.VITE_SERVICE_URL,  // 开发环境不设置 baseURL
  timeout: 100000,
});

// 请求发起前拦截
instance.interceptors.request.use(
  (config) => {
    if (config.url === '/api/file/upload') {
      //上传图片到图库请求头处理
      config.headers['Content-Type'] = 'multipart/form-data'
    }

    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers = {
        ...config.headers, // 保留原有的 headers 配置
        "Authorization": `Bearer ${accessToken}`
      };
    }
    
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);




// 响应拦截（请求返回后拦截）
let isShowing401Error = false; // 标志位，用于控制 401 提示是否已显示

instance.interceptors.response.use(
  (res) => {
    // 判断URL 为 /api/file/read 不拦截
    
    if (res.config.url == '/api/file/read') {
      return res;
    }else if(res.config.url == '/api/model'){
      return res.data;
    }
    if (res.data.data) {
      return res.data.data;
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const http = {
  get(url, params) {
    return instance.get(url, { params: params });
  },
  post(url, params, header = {},responseType='json') {
    const options = {
      url,
      method: "POST",
      data: params,
      headers: Object.assign({ 'Content-Type': 'application/json' }, header),
      responseType:responseType,
    }
    return instance.request(options);
  },
  patch(url, params, header = {}) {
    const options = {
      url,
      method: "PATCH",
      data: params,
      headers: Object.assign({ 'Content-Type': 'application/json' }, header),
    };
    return instance.request(options);
  },
  put(url, params, header = {}) {
    const options = {
      url,
      method: "PUT",
      data: params,
      headers: Object.assign({ 'Content-Type': 'application/json' }, header),
    }
    return instance.request(options);
  },
  del(url, params, header = {}) {
    const options = {
      url,
      method: "DELETE",
      params: params,
      headers: Object.assign({ 'Content-Type': 'application/json' }, header),
    }
    return instance.request(options);
  },
};

export default http;
