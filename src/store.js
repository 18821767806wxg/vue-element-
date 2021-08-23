import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userLogin: true,
        detailList: []
    },
    mutations: {
        show(state) {
            state.userLogin = true
        }
        ,
        hide(state) {
            state.userLogin = false
        },
        setdetailList(state, data) {
            state.detailList = data
        }
    }
})
export default store