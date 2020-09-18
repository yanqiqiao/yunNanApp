<template>
    <div id="headTop" class="head-top">
        <div class="over_hid head-top-box">
            <div class="b_right">
				<span style="margin-right: 20px;">{{administrator}}</span>
                <span @click="logout" title="退出">退出系统</span>
            </div>
        </div>
    </div>
</template>
<script>
  export default {
    name: 'headTop',
    data(){
      return{
        administrator:null
      }
    },
	created (){
	    this.administrator ="欢迎您 "+sessionStorage.userName+"!";
	 },
    mounted(){
    },
    methods:{
         logout(){//退出
            sessionStorage.clear();
			      this.$router.push({ name: "login", params: {} });
        }
	}
  }
</script>
<style lang="less" scoped>
  .head-top{
    width: 100%;
    height:50px;
    line-height:50px;
    padding-left:260px;
    padding-right:20px;
    box-sizing: border-box;
    overflow:hidden;
    zoom:1;
	color:#FFFFFF;
    background-color:#248DAC;
    position: absolute;
    top: 0;
    right: 0;
	text-align: left;
    left: 0;
    transition:.5s;
  }
</style>

