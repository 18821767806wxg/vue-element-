import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { JSEncrypt } from 'encryptlong'
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import 'nprogress/nprogress.css'
console.log('1111', JSEncrypt)
// 阻止启动生产消息
// Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
