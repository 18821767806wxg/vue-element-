import http from "../utils/http";
// 获取所有角色的列表
export function getRoles() {
    return http.get('roles')
}
// 删除权限
export function deleteRole(id, rightId) {
    return http.delete(`roles/${id}/rights/${rightId}`)
}
// 获取所有权限的数据
export function getAllroles() {
    return http.get('rights/tree')
}
// 点击分配角色权限
export function allotRight_Api(roleId, rids) {
    return http.post(`roles/${roleId}/rights`, { rids: rids })
}

