import Vue from 'vue';
import Vuex from 'vuex';

import nav from './map/nav';
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    nav,
  },
  mutations: {
    setState(state, { module, key, value }) {
      setRespondValByKey(state[module], key, value);
    },
  },
});
