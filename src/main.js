import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import Axios from 'axios'
import Common from './assets/js/common.js'
import './assets/css/base.css'
import './assets/css/style.css'
import './assets/css/swiper.min.css'
import config from '../static/server'

Vue.use(ElementUI)
Vue.use(VueResource)
Vue.use(Common)
Vue.prototype.$axios = Axios
Vue.config.productionTip = false
//Axios.defaults.baseURL = config.BASEURL;
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
// 超时时间
Axios.defaults.timeout = 50000;
// http请求拦截器 请求之前的一些操作
Axios.interceptors.request.use(config => {
  const Authorization = sessionStorage.Authorization;//获取Authorization
  if (Authorization) {  // 每次发送请求之前判断是否存在Authorization，如果存在，则统一在http请求的header都加上Authorization，不用每次请求都手动添加了
    config.headers.Authorization = Authorization;
  }
  return config
}, error => {
  Message.error({
    message: '加载超时'
  });
  return Promise.reject(error)
});



new Vue({
  el: '#app',
  router,
	store,
  components: { App },
  template: '<App/>'
})
