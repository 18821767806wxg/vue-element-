import http from '@/utils/http.js'
// 获取所有的菜单 promise要异步接收数据
export function getMenu() {
    return http.get('menus')
}