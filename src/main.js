import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import axios from 'axios'
// 配置请求的跟路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

//添加请求拦截器
axios.interceptors.request.use(config => {
  console.log("config", config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
}),
  // //添加响应拦截器
  axios.interceptors.response.use(function (response) {
    console.log("55555777", response)
    console.log('88888', router.currentRoute)
    //对响应数据做些事
    return response;
  }, function (error) {
    //请求错误时做些事
    return Promise.reject(error);
  });
// 给vue原型上挂在axios
Vue.prototype.$http = axios
// 阻止启动生产消息
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
