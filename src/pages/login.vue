<template>
  <div class="login">
    <div style="color: #FFFFFF;font-size: 0.7rem;text-align: center;padding-top: 2.2rem">档案管理系统</div>
    <div style="color: #FFFFFF;font-size: 0.4rem;text-align: center;padding-top: 0.3rem">FILE MAMAGEMENT</div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="login-ruleForm">
      <el-form-item prop="name">
        <div class="flex flex-direction align-items-center" style="margin: 2rem 1.6rem 0 1.6rem;border-bottom: 1px #ffffff solid;height: 0.8rem">
          <img src="../assets/img/icon_user.png" style="width: 0.5rem;height: 0.5rem">
          <div style="color: #ffffff;margin:0 0.3rem 0 0.3rem;font-size: 0.4rem">用户名</div>
          <el-input v-model="ruleForm.name" placeholder="请输入登录名称" style="width: 60%;background: rgba(255,255,255,0);border: none;height: 100%;color: #ffffff;outline: none">
          </el-input>
        </div>
      </el-form-item>

      <el-form-item prop="password">
        <div class="flex flex-direction align-items-center" style="margin: 0.6rem 1.6rem 0 1.6rem;border-bottom: 1px #ffffff solid;height: 0.8rem">
          <img src="../assets/img/icon_pwd.png" style="width: 0.5rem;height: 0.5rem">
          <div style="color: #ffffff;margin:0 0.3rem 0 0.3rem;font-size: 0.4rem">密码</div>
          <el-input v-model="ruleForm.password" placeholder="请输入登录密码" @keyup.enter.native="goLogin()" show-password
            style="width: 60%;background: rgba(255,255,255,0);border: none;height: 100%;color: #ffffff;outline: none">
          </el-input>
        </div>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="loginBtn" @click="goLogin()">登&nbsp;&nbsp;录</el-button>
  </div>
</template>
<script>
  import API from '@/utils/api.js';
  import md5 from 'md5'
  export default {
    props: {},
    data() {
      return {
        ruleForm: {
          name: "",
          password: ""
        },
        rules: {
          name: [{
            required: true,
            message: "请输入登录名称",
            trigger: "blur"
          }],
          password: [{
            required: true,
            message: "请输入登录密码",
            trigger: "blur"
          }]
        }
      };
    },
    mounted() {

    },
    methods: {
      goLogin() {
        // 点击登录
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            // 检验通过
            this.loginAsync();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      async loginAsync() {
        const {
          code,
          data,
          msg
        } = await API.loginAction({
          accountNumber: this.ruleForm.name,
          password: md5(this.ruleForm.password)
        });
        if (code == '0000') {
          sessionStorage.token = data.token;
          sessionStorage.user_id = data.userId;
          sessionStorage.user_name = data.userName;
          sessionStorage.departmentId = data.departmentId;
          sessionStorage.departmentName = data.departmentName;
          this.$router.push('/dataShow');
        } else {
          this.$message(msg);
        }
      },
    }
  }
</script>
<style lang="less">
  .login {
    position: absolute;
    width: 100%;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    height: 100%;
    background-image: url("../assets/img/app_login_bg.png");
    background-repeat: no-repeat;
    background-position: bottom;
    background-size: 100% 100%;
    background-clip: content-box;
    overflow: hidden;

    .el-form-item__error {
      margin-left: 41%;
      margin-top: 10px;
    }

    .loginBtn {
      margin: 1.2rem 1.6rem 0 1.6rem;
      height: 1rem;
      line-height: 0.4rem;
      width: 4rem;
      background: rgba(0, 18, 78, 0.56);
      border-radius: 3px;
      color: #FFFFFF;
      text-align: center;
      font-size: 0.4rem;
    }

    .flex {
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flexbox;
      display: flex;
    }

    .flex-direction {
      flex-direction: row;
      -webkit-flex-direction: row;
    }

    .align-items-center {
      align-items: center;
    }
  }
</style>
