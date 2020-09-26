公共预览组件
<template>
  <div>
    <div class="pdfCon" id="pdfCon"></div>
  </div>
</template>

<script>
import * as pd from 'pdfobject'
import watermark from 'watermark-dom'
// import {loadScript} from '@/utils/common'

export default {
  mounted() {
    let fileLocation = 'http://39.99.245.16:86/';
    let pathSplice = this.base64To(this.$route.params.filePath).split('/');
    let pathLength = pathSplice.length;
    let url = fileLocation + pathSplice[pathLength - 1];
    pd.embed(url, "#pdfCon");
    // loadScript()
    watermark.load({ watermark_txt: "西南招标" })
  }
}
</script>

<style>
.pdfCon{
  height: 100vh;
}
</style>