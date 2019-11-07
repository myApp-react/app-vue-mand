import {
    getPoints
} from "@/api/mine";

const mine = {
    state: {
        avatar: '',
        userInfo: [],
        integral: 0,
    },
    mutations: {
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo
        },
        SET_INTEGRAL: (state, integral) => {
            state.integral = integral
        }
    },
    actions: {
        async GetPoints({
            commit
        }) {
            try {
                const res = await getPoints();
                const {
                    data,
                    code
                } = res;
                if (code === '200') {
                    commit('SET_INTEGRAL', data.point)
                }
            } catch (err) {
                console.log('获取积分失败：', err)
                commit('SET_INTEGRAL', 0)
            }
        }
    }
}

export default mine