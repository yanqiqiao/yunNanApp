<template>
  <div class="viewMain">
    <!-- <img style="width: 300px" src="http://39.99.245.16:86/0721304056764916035584.jpg" alt=""> -->
    <div @click="print()">
      下载
    </div>
    <iframe :src="iframeUrl" id="frame" frameborder="0" ref="iframe"></iframe>
  </div>
</template>

<script>
import { base64To } from '@/utils/common';
import axios from 'axios';
import API  from '@/utils/api'
export default {
  data() {
    return {
      iframeUrl:''
    }
  },
  mounted() {
    console.log(this.base64To(this.$route.params.filePath).split('/')[3])
    let url = 'http://39.99.245.16:86/' + this.base64To(this.$route.params.filePath).split('/')[3];
    console.log(url)
    this.iframeUrl = ('http://39.99.245.16:85/onlinePreview?url='+encodeURIComponent(url) +'&watermarkTxt=西南招标&officePreviewType=pdf');
    window.location.href = ('http://39.99.245.16:85/onlinePreview?url='+encodeURIComponent(url))
    //  axios({
    //   url: '/preView/onlinePreview/',
    //   method: 'get',
    //   params: {
    //     url: url,
    //     // watermarkTxt: '高晓东',
    //     // officePreviewType: 'pdf'
    //   },
    // }).then(res => {
    //   console.log(res.data)
    //   // this.preViewHtml = res.data;
    //   // document.getElementById('yes').innerHTML = res.data;
    // })
  },
  methods: {
    print() {
      window.print()
    }
  }
}
</script>

<style>
iframe {
  display: block; /* iframes are inline by default */
  border: none; /* Reset default border */
  height: 100vh; /* Viewport-relative units */
  width: 100vw;
  }
</style>