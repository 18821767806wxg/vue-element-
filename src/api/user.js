import http from '@/utils/http.js'
// 获取用户数据列表
export function getUser(params) {
    return http.get('users', {
        params: {

            query: params.query,
            // 当前的页数
            pagenum: params.pagenum,
            // 当前每页显示多少条数据
            pagesize: params.pagesize

        }
    })
}
// 修改用户状态
export function handleSwitchBtn(params) {
    return http.put(
        `users/${params.id}/state/${params.mg_state}`
    )
}
//删除用户
export function deleteUser(params) {
    return http.delete(`users/${params.id}`)
}
// 添加用户
export function addUser(params) {
    return http.post('users', params)
}
// 修改用户信息
export function editUser(params) {
    return http.put(
        'users/' + params.id,
        {
            email: params.email,
            mobile: params.mobile
        }
    )
}
//  修改用户数据
export function alterUserApi(params) {
    return http.get('users/' + params)
}