import Vue from 'vue'
import Router from 'vue-router'
const login = resolve => require(['@/pages/login'], resolve)
const dataShow = resolve => require(['@/pages/dataShow'], resolve)
Vue.use(Router)
export default new Router({
  base: '',
  mode: 'history',
  routes: [{
      path: '/',
      name: 'login',
      component: login
    }, {
      path: '/dataShow',
      name: 'dataShow',
      component: dataShow
    },
    {
      name: 'fileView',
      path: '/fileView/:dirTypeName/:directorId/:filePath',
      component: () => import( /* webpackChunkName: "documenManage" */ '@/components/preview/fileView.vue'),
      hidden: true,
      meta: {
        name: 'fileView'
      }
    }
  ]
})
