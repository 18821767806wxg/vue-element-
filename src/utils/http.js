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
const pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
const cancelToken = axios.CancelToken
const removeRepeatUrl = (ever) => {
    // console.log('?????', ever)
    // console.log('?????', pending)
    for (const p in pending) {
        if (pending[p].u === ever.url + '&' + ever.method) { // 当当前请求在数组中存在时执行函数体
            pending[p].f() // 执行取消操作
            pending.splice(p, 1) // 把这条记录从数组中移除
        }
    }
}
//添加请求拦截器
http.interceptors.request.use(config => {
    // 在一个ajax发送前执行一下取消操作
    console.log('request', config)
    removeRepeatUrl(config)
    config.cancelToken = new cancelToken((c) => {
        // 自定义唯一标识
        pending.push({ u: config.url + '&' + config.method, f: c })
    })

    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    // 在最后必须 return config
    return config
}),
    // //添加响应拦截器
    http.interceptors.response.use(function (response) {
        // console.log("55555777", response)
        // console.log('88888', router.currentRoute)
        //对响应数据做些事 `
        NProgress.done()
        return response;
    }, function (error) {
        //请求错误时做些事
        return Promise.reject(error);
    });
export default http