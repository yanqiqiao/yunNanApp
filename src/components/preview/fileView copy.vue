文件预览组件
使用说明：
所有的预览都是重新打开一个页面：
文件来源：1 是列表里面的预览，2是版本里面的预览。3是模版文件的预览
如果不需要预览有水印,父级目录id这个值传module就可以了
例如：
   window.open(`/fileView/${文件的id}/${文件的后缀名}/${文件来源}/${父级目录id}`, "_blank");
<template>
  <div class="pdfView">
    <div class="tools">
      <el-button type="info" size="mini" @click.stop="prePage">上一页</el-button>
      <el-button type="info" size="mini" @click.stop="nextPage">下一页</el-button>
      <span class="page">{{pageNum}}/{{pageTotalNum}}</span>
      <el-button type="info" size="mini" @click.stop="counterClock" icon="el-icon-refresh-left"></el-button>
      <el-button type="info" size="mini" @click.stop="clock" icon="el-icon-refresh-right"></el-button>
    </div>
    <pdf
      class="pdfStyle"
      ref="pdf"
      :src="url"
      :page="pageNum"
      :rotate="pageRotate"
      @progress="loadedRatio = $event"
      @page-loaded="pageLoaded($event)"
      @num-pages="pageTotalNum=$event"
      @error="pdfError($event)"
      @link-clicked="page = $event"
    ></pdf>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import bus from "utils/bus";
import axios from 'axios';
import API  from '@/utils/api'
var CryptoJS = require("crypto-js")
export default {
  name: 'fileView',
  components: {
    pdf,
  },
  data() {
    return {
      preViewHtml: '',
      water_mark_fomat: '', // 水印的值
      proxyUrl: window.config.context,
      url: "",
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0,
      loading: true // 加载中
    };
  },
  mounted() {
    let pa = JSON.stringify({"file_path":"a4cf0f2d7c637e0a60430c082de6ec23.png","water_mark_fomat":"21123"})
    console.log(AES_ECB_encrypt(pa,'O8KYyW4heXt/Ah8ffHwjlq==' ))
    // AES ECB模式加密，没有iv
    function AES_ECB_encrypt(message, key) {
      // utf8字符串—>WordArray对象，WordArray是一个保存32位整数的数组，相当于转成了二进制
      let keyHex = CryptoJS.enc.Utf8.parse(key); //
      let messageHex = CryptoJS.enc.Utf8.parse(message);
      let encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();// base64结果
      //return encrypted.ciphertext.toString();   // 二进制结果
    }
  },
  watch: {
    loadedRatio() {
      console.log(this.loadedRatio)
    },
  },
  methods: {
   async getFileBolb() {
      // 根据路由的参数获取文件流
      const loading = this.$loading({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
       // 获取文件需要加的水印
      const{code, data}  = await API.checkWaterMarkExistAPI({
        "addwatermark":"1",
        "director_id": this.$route.params.directorId === 'module'? 'module': this.$route.params.directorId,
      })
    this.water_mark_fomat = data.water_mark_fomat;
      // water_mark_fomat，typestr，file_id，file_type
      // water_mark_fomat，typestr，file_path
      axios({
        method: 'post',
        url: '/print/download/waterMarkPrint',
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
          "token":sessionStorage.getItem("token")
        },
        data: {
          water_mark_fomat: this.water_mark_fomat,
          file_path: this.base64To(this.$route.params.filePath),
          typestr: this.$changePrintfParams(this.$route.params.dirTypeName),  // 文件类型名，用来给后端判断转pdf
        }
      }).then(res => {
        loading.close()
        this.url = this.getObjectURL(res.data)
      })
    },
    // 上一页函数，
    prePage() {
      var page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },
    // 下一页函数
    nextPage() {
      var page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },
    // 页面顺时针翻转90度。
    clock() {
      this.pageRotate += 90;
    },
    // 页面逆时针翻转90度。
    counterClock() {
      this.pageRotate -= 90;
    },
    // 页面加载回调函数，其中e为当前页数
    pageLoaded(e) {
      this.curPageNum = e;
    },
    // 其他的一些回调函数。
    pdfError(error) {
      console.error(error);
    },
    // 打印全部
    pdfPrintAll() {
      this.$refs.pdf.print();
    },
    // 打印指定部分
    pdfPrint() {
      this.$refs.pdf.print(100, [1, 2]);
    },
    // 将返回的流数据转换为url
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        // basic
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        // webkit or chrome
        try {
          url = window.webkitURL.createObjectURL(file);
        } catch (error) {}
      } else if (window.URL != undefined) {
        // mozilla(firefox)
        try {
          url = window.URL.createObjectURL(file);
        } catch (error) {}
      }
      return url;
    },
  },
};
</script>

<style lang="less" scoped>
.pdfView {
  transition: all 0.5s;
  min-height: 100vh;
  background: rgb(82, 86, 89);
  margin: 0 auto;
  .loadingDiv{
    color: #fff;
  }
  .tools {
    text-align: right;
    background: #0601019c;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 30px;
    .page {
      display: inline-block;
      border: 1px solid #fff;
      color: #fff;
      margin: 0 10px;
      padding: 0 10px;
    }
  }
  .pdfStyle{
    padding: 20px 30px;
    width: 900px;
    margin: 0 auto;
  }
}
</style>