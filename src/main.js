import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index.js'
import VueResource from 'vue-resource'
import ElementUI from 'element-ui'
import Axios from 'axios'
import './assets/css/base.css'
import './assets/css/style.css'
import './assets/css/swiper.min.css'
import config from '../static/server'
import {formaterFileSize, elementUpSize, toBase64, base64To, previewMethods, isCanPreView, splitPath, commonDownloadfile} from '@/utils/common.js';


window.goPdfPage = function(bind ) {
  window.open(`/fileView/${bind.getAttribute('dirTypeName')}/${bind.getAttribute('parentId')}/${toBase64(bind.getAttribute('filePath'))}}`)
};

Vue.directive('pdfPreview', {
  /**
   * v-pdfPreview="{
   *  'filePath':scope.row.filePath, 文件路径 例如‘home/file/23432i4320.png’
   *  'dirTypeName':  scope.row.dirTypeName, 文件类型名 例如 png
   *  'parentId':scope.row.parentId 目录ID 如果没有传 module
   * }
  */
  bind: function(el, bind) {
    let filePath = bind.value.filePath,
    dirTypeName = bind.value.dirTypeName, // 文件类型名
    parentId= bind.value.parentId, // 文件父级目录id
    inml = `<span  parentId="${parentId}" filePath="${filePath}" dirTypeName="${dirTypeName}" onclick="goPdfPage(this)">预览</span>`; // 动态插入的dom inml
    el.innerHTML = inml;
  }
})
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.prototype.$axios = Axios
Vue.config.productionTip = false
Axios.defaults.baseURL = process.env.NODE_ENV === "development" ? "": config.BASEURL;
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
