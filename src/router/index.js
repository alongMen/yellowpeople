import Router from 'vue-router';

import Vue from 'vue';
import system from './map/system';
import content from './map/content';
import user from './map/user';
import ad from './map/ad';
import activities from './map/activities';
Vue.use(Router);
export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: { name: 'data-type'},
      component: () => import('@/views/index.vue'),
      children: [system, content, user, ad, activities],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index'),
      meta:{noAuth:true},
      children: [],
    },
  ],
});
