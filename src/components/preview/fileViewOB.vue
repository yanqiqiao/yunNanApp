<template>
  <div>
    <div class="pdfCon" id="pdfCon"></div>
  </div>
</template>

<script>
import * as pd from 'pdfobject'
export default {
  mounted() {
    // http://39.99.245.16:86/0721304097188309364736.pdf
    console.log(pd)
    pd.embed("http://39.99.245.16:86/0721304097188309364736.pdf", "#pdfCon");
  }
}
</script>

<style>
.pdfCon{
  height: 100vh;
}
</style>