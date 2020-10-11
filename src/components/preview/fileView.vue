<template>
  <div class="pdf_main">
    <!-- 预览 -->
      <div class="loading_text" v-if="loading">
        <p>正在从服务器获取资源 {{ progressLoade }}%</p>
        <p>若文件过大，请耐心等待...</p>
      </div>
      <div class="spinner" v-if="loading">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    <div class="pdf-container" v-if="isPdf">
      <canvas v-for="page in pages" :id="'canvas' + page" :key="page"></canvas>
    </div>
    <div class="img-container" v-else>
      <img :src="imageUrl" />
    </div>
  </div>
</template>

<script>
import PDFJS from "vue-pdfjs-update";
PDFJS.GlobalWorkerOptions.workerSrc = "vue-pdfjs-update/build/pdf.worker.js";
import { AES_ECB_encrypt } from "@/utils/aes";
import axios from "axios";
import API from "@/utils/api";
// import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
// import NProgress from 'nprogress' // 引入nprogress插件
// import 'nprogress/nprogress.css'
export default {
  data() {
    return {
      progressLoade: 0,
      loading:true, // loading
      imageUrl:'', // 图片预览地址
      fileName: '预览文件',
      pdfDoc: null,
      pages: 0,
      showPdf: true,
      water_mark_fomat: "西南招标",
    };
  },
  mounted() {
    this.getMaker();
  },
  computed: {
    isPdf() {
      if (this.getFilePath().split('.')[1] === 'pdf') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    async getMaker() {
      // 获取水印
      const { code, data } = await API.checkWaterMarkExistAPI({
        addwatermark: "1", // 加水印
        director_id:
          this.$route.params.directorId === "module"
            ? "module"
            : this.$route.params.directorId,
      });
      this.water_mark_fomat = data.water_mark_fomat;
      this.getFilesBolb();
    },
    getFilesBolb() {
      // 获取文件流预览--有水印
      let params = JSON.stringify({
        file_path: this.getFilePath(),
        water_mark_fomat: this.water_mark_fomat,
      });
      console.log(params);
      axios({
        method: "post",
        url: "/print/download/waterMarkPrint",
        responseType: "blob",
        headers: {
          // 'Cache-Control': 'no-cache',
          "Content-Type": "application/json",
          token: sessionStorage.getItem("token"),
          // useCache: true
        },
        // dapter: cacheAdapterEnhancer(axios.defaults.adapter, { enabledByDefault: false, cacheFlag: 'useCache'}),
        data: {
          req: AES_ECB_encrypt(params, "O8KYyW4heXt/Ah8ffHwjlq=="),
        },
        onDownloadProgress:  (progressEvent) => {
          // 对原生进度事件的处理
          this.progressLoade = Math.floor(progressEvent.loaded / progressEvent.total * 100);
          if(this.progressLoade== 100) {
            this.loading = false;
          }
        },
      })
        .then((res) => {
          this.imageUrl = this.getObjectURL(res.data)
          if(this.isPdf) {
            // pdf 需要读取流
             this.loadFile(this.imageUrl);
          } else{
              // 如果是图片直接显示
              return false
          }
        })
        .catch((err) => {
          return false;
        });
    },
    loadFile(url) {
      // url = '/ftp/0721305708387375509504.pdf';
      PDFJS.getDocument(url)
        .then((pdf) => {
          this.pdfDoc = pdf
          this.pages = this.pdfDoc.numPages
          this.$nextTick(() => {
            this.renderPage(1)
          })
        })
    },
    renderPage(num) {
      this.pdfDoc.getPage(num).then((page) => {
        let canvas = document.getElementById("canvas" + num);
        let ctx = canvas.getContext("2d");
        let dpr = window.devicePixelRatio || 1; // 设备像素比
        let bsr =
          ctx.webkitBackingStorePixelRatio ||
          ctx.mozBackingStorePixelRatio ||
          ctx.msBackingStorePixelRatio ||
          ctx.oBackingStorePixelRatio ||
          ctx.backingStorePixelRatio ||
          1; // 浏览器在渲染canvas之前会用几个像素来来存储画布信息,类似img
        let ratio = dpr / bsr;
        let viewport = page.getViewport(1.5);
        canvas.height =viewport.height;
        canvas.width = viewport.width;
        let renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        page.render(renderContext);
        if (this.pages > num) {
          this.renderPage(num + 1);
        } else {
          this.closeServerLoadingHandle();
        }
      });
    },
    getFilePath() {
      // 获取文件路径
      let pathSplice = this.base64To(this.$route.params.filePath).split("/");
      let pathLength = pathSplice.length;
      return pathSplice[pathLength - 1];
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
.loading_text{
  font-size: 18px;
  color: #fff;
  position: absolute;
  left: 20px;
  top: 30px;
  & p{
    height: 40px;
    line-height: 40px;
  }
}
.spinner {
  position: absolute;
  width: 80px;
  height: 40px;
  text-align: center;
  font-size: 10px;
  top: 50%;
  left: 50%;
  transform: translateY(-20px);
  transform: translateX(-40px);
}

.spinner > div {
  background-color: #0a65c0;
  height: 100%;
  width: 6px;
  display: inline-block;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
 .spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
.pdf_main{
  min-width: 100vw;
  min-height: 100vh;
  background:#121313f5;
}
.pdf-container {
  width: 80vw;
  margin: 0 auto;
  text-align: center;
  & img{
    width: 70vw;
    display: inline-block;
  }
}
.img-container {
  width: 90vw;
  margin: 0 auto;
  text-align: center;
  & img{
    max-width: 80vw;
    display: inline-block;
  }
}
</style>