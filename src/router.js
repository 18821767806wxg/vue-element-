import Vue from 'vue'
import Router from 'vue-router'
// import Login from './page/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './page/Login.vue')//路由懒加载
// import Home from './components/Home.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Welcome.vue')
// import Welcome from './components/Welcome.vue'
import User from './page/user/User.vue'
import Roles from './page/power/Roles'
import Rights from './page/power/Rights'
import Categories from './page/shops/Categories.vue'
import Goods from './page/shops/Goods.vue'
import Params from './page/shops/Params.vue'
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: Login },
    {
      path: '/home',
      component: () => import(/* webpackChunkName: "login_home_welcome" */ './components/Home.vue'),//路由懒加载
      redirect: '/welcome',
      children: [//嵌套子路由
        {
          path: '/welcome', name: 'welcome', component: Welcome
          // // 路由独享的守卫
          // beforeEnter: (to, from, next) => {
          //   console.log("to88888", to)
          //   debugger
          //   if (to.path == '/welcome') next('/users')
          // }
        },
        { path: '/users', name: 'users', component: User },
        { path: '/roles', name: 'roles', component: Roles },
        { path: '/rights', name: 'rights', component: Rights },
        { path: '/categories', name: 'categories', component: Categories },
        { path: '/goods', name: 'goods', component: Goods },
        { path: '/params', name: 'params', component: Params }
      ]
    }
  ]
})

// 挂载路由导航守卫 全局前置导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //     next()  放行    next('/login')  强制跳转
  console.log("5555", to)
  console.log("5555", from)
  // debugger
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
