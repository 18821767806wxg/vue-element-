import axios from 'axios'
// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
// 配置请求的跟路径
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'


// 简单配置  进度条配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

// // 给vue原型上挂在axios
// Vue.prototype.$http = axios

const http = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 10000, //
});

//添加请求拦截器
http.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
}),
    // //添加响应拦截器
    http.interceptors.response.use(function (response) {
        console.log("55555777", response)
        // console.log('88888', router.currentRoute)
        //对响应数据做些事 `
        NProgress.done()
        return response;
    }, function (error) {
        //请求错误时做些事
        return Promise.reject(error);
    });
export default http