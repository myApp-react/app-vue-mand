import Vue from 'vue'
import Vuex from 'vuex'
import mine from './modules/mine'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        mine,
    },
    getters
})

export default store