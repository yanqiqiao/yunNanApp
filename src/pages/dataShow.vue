<template>
  <div class="dataShow">
    <div id="top">
      <div class="flex">
        <div class="flex flex-direction align-items-center">
          <img src="../assets/img/app_btn_back.png" style="height: 18px;margin:0 10px 0 10px">
        </div>
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText" style="width: 100%;margin-right: 30px;">
        </el-input>
      </div>
    </div>
    <div class="swiper-container" id="page">
      <div class="swiper-wrapper">
        <!-- 我的文件-->
        <div class="swiper-slide slidepage">
          <template v-if="allmsg&&allmsg.length>0">
            <div style="background: #fff;text-align: left;margin-top: 0.3rem;">
              <el-row :gutter="20" v-for="(item, index) in allmsg||[]" :key="index" style="height: 1.4rem;border-bottom: 1px solid #ededed;">
                <el-col :span="2" style="line-height: 1.4rem;">
                  <img :src="item.icon" style="height: 0.5rem;margin:0 0.1rem">
                </el-col>
                <el-col :span="22">
                  <div style="margin-top: 0.14rem;">
                    {{item.title}}
                  </div>
                  <div style="margin-top: 0.2rem;color: #ccc;font-size: 0.14rem;">
                    {{item.content}}
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
          <template v-else>
            <div style="margin-top:3rem;">暂无文件</div>
          </template>
        </div>
        <!-- 我的审批-->
        <div class="swiper-slide slidepage">
          <div style="text-align: left;margin-left: 0.1rem;position: absolute;margin-top: 0.3rem;">
            <el-button type="text" @click="type='3';getApproveRecordList();">全部</el-button>
            <el-button type="text" @click="type='1';getApproveRecordList();">待审批单据</el-button>
            <el-button type="text" @click="type='2';getApproveRecordList();">已审批单据</el-button>
          </div>
          <template v-if="boxTableData&&boxTableData.length>0">
            <div style="background: #fff;text-align: left;margin-top: 1rem;">
              <el-row :gutter="2" style="line-height: 0.4rem;border-bottom: 1px solid #ededed;clear: both;">
                <el-col :span="5">
                  <el-checkbox v-model="checkedall" @change="checkedallFun" style="height: 0.5rem;margin:0 0.1rem">全选</el-checkbox>
                </el-col>
                <el-col :span="10" >
                  <el-button type="text" size="mini" @click="ifthroughtitle='批量审批通过';showDialog()">批量通过</el-button>
                  <el-button type="text" size="mini" @click="ifthroughtitle='批量审批退回';showDialog()">批量退回</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-for="(item, index) in boxTableData||[]" :key="index" style="clear: both;height: 1.8rem;border-bottom: 1px solid #ededed;">
                <el-col :span="4" style="line-height: 1.8rem;">
                  <el-checkbox v-model="item.checked" style="height: 0.5rem;margin-left:0.1rem"></el-checkbox>
                  <img :src="item.icon" style="height: 0.5rem;margin-left:0.1rem">
                </el-col>
                <el-col :span="14">
                  <div style="margin-top: 0.1rem;font-size:0.2rem;font-weight: 700;">
                    {{item.title}}
                  </div>
                  <div style="margin-top: 0.2rem;color: #333;font-size: 0.14rem;">
                    <span style="margin-right: 0.2rem;"> {{item.code}}</span>
                  </div>
                  <div style="margin-top: 0.2rem;color: #333;font-size: 0.14rem;">
                    <span style="margin-right: 0.2rem;"> {{item.type}} </span>
                    {{item.person}}
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="margin-top: 0.2rem;color: #ccc;font-size: 0.14rem;">
                    {{item.time}}
                  </div>
                  <!--  v-if="type=='1'" -->
                  <el-button type="text" size="mini" @click="approvalObj=item;ifthroughtitle='审批通过';ifthrough=true">通过</el-button>
                  <el-button type="text" size="mini" @click="approvalObj=item;ifthroughtitle='审批退回';ifthrough=true">退回</el-button>
                </el-col>
              </el-row>
            </div>
          </template>
          <template v-else>
            <div style="margin-top:3rem;">暂无审批</div>
          </template>
        </div>
        <!-- 我的消息提醒 -->
        <div class="swiper-slide slidepage">
          <template v-if="allmsg&&allmsg.length>0">
            <div style="background: #fff;text-align: left;margin-top: 0.3rem;">
              <el-row :gutter="20" v-for="(item, index) in allmsg||[]" :key="index" style="height: 1.4rem;border-bottom: 1px solid #ededed;">
                <el-col :span="2" style="line-height: 1.4rem;">
                  <img :src="item.icon" style="height: 0.5rem;margin:0 0.1rem">
                </el-col>
                <el-col :span="22">
                  <div style="margin-top: 0.14rem;">
                    {{item.title}}
                  </div>
                  <div style="margin-top: 0.2rem;color: #ccc;font-size: 0.14rem;">
                    {{item.content}}
                  </div>
                </el-col>
              </el-row>
            </div>
          </template>
          <template v-else>
            <div style="margin-top:3rem;">暂无消息提醒</div>
          </template>
        </div>
      </div>
    </div>
    <div class="bottomClass">
      <div class="swiper-container" id="nav">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img src="../assets/img/file.png" style="width: 0.8rem;height: 0.8rem;margin-right: 10px">
            <span>我的文件</span>
          </div>
          <div class="swiper-slide" @click="type='3';getApproveRecordList();">
            <img src="../assets/img/shenpi.png" style="width: 0.8rem;height: 0.8rem;margin-right: 10px">
            <span>我的审批</span>
          </div>
          <div class="swiper-slide" @click="getmsgFun">
            <img src="../assets/img/msg.png" style="width: 0.8rem;height: 0.8rem;margin-right: 10px">
            <span>我的消息提醒</span>
          </div>
          <div class="bar">
            <div class="color"></div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog :title="ifthroughtitle" width="80%" :visible.sync="ifthrough" append-to-body :close-on-click-modal="false">
      是否确认{{ifthroughtitle}}？
      <el-row :gutter="20">
        <el-col :span="24" style="margin-left:calc(50% - 1rem) ;margin-top: 1rem;">
          <el-button type="primary" size='mini' @click="onSearchFun">确认</el-button>
          <el-button size='mini' @click='ifthrough=false'>取消 </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
  import spicon from '@/assets/img/spicon.png';
  import daoqi from '@/assets/img/daoqi.png';
  import tixing from '@/assets/img/tixing.png';
  import yisp from '@/assets/img/yisp.png';
  import daisp from '@/assets/img/daisp.png';
  import {
    swiperFun
  } from './swiper.js'
  import API from '@/assets/js/api.js';
  export default {
    props: {},
    data() {
      return {
        searchText: null,
        fileList: [{
          name: 23
        }],
        boxTableData: [],
        pn: 1,
        ps: 20,
        type: '1',
        searchText: '',
        allmsg: [],
        checkedall: false,
        ifthrough: false,
        ifthroughtitle: '审批通过',
        approvalObj: null,
      };
    },
    mounted() {
      swiperFun();
      this.getmsgFun();
    },
    methods: {
      showDialog() {
        let arr = this.boxTableData.filter(a => {
          return a.checked;
        })
        if (arr.length == 0) {
          this.$message('请选择需要审批的条目。');
        } else {
          this.ifthrough = true;
        }
      },
      checkedallFun() {
        if (this.checkedall) {
          this.boxTableData.forEach(a => {
            a.checked = true;
          })
        } else {
          this.boxTableData.forEach(a => {
            a.checked = false;
          })
        }
        this.$nextTick(() => {
          this.boxTableData = JSON.parse(JSON.stringify(this.boxTableData));
        })
      },
      async getmsgFun() {
        this.allmsg = [];
        /*  const {
            code,
            data,
          } = await API.remindbasicinfo();
          if (code == '0000') { */
        let obj = {
          borrow: [{
            document_code: 2121
          }],
          approve: [{
              approve_type: 1,
              document_code: 121
            },
            {
              approve_type: 2,
              document_code: 121
            }
          ],
          expire: [{
            approve_type: 1,
            document_code: 121,
            approve_status: 1
          }]
        }
        obj.borrow.forEach(a => {
          this.allmsg.push({
            icon: daoqi,
            title: '借阅到期提醒',
            content: '文档编号：' + a.document_code + '借阅截止时间还有三小时，请及时处理'
          })
        });
        obj.approve.forEach(a => {
          let status = (a.approve_type == 1) ? '正在送审...' : '正在借阅...';
          this.allmsg.push({
            icon: spicon,
            title: '审批提醒',
            content: '文档编号：' + a.document_code + '' + status + '请您审批'
          })
        });
        obj.expire.forEach(a => {
          let title = (a.approve_type == 1) ? '送审审批提醒' : '借阅审批提醒';
          let status = (a.approve_status == 1) ? '审批成功' : '审批失败';
          this.allmsg.push({
            icon: tixing,
            title: title,
            content: '文档编号：' + a.document_code + '已经' + status
          })
        });
        //}
      },
      onSearchFun() {
        let data = [];
        if (this.ifthroughtitle.indexOf('批量') > -1) { //批量操作
          data = this.boxTableData.filter(a => {
            return a.checked
          })
        } else {
          data = [{
            approveStatus: (this.ifthroughtitle == '审批通过') ? 1 : 2,
            approveType: this.approvalObj.approveType,
            approveProcessId: this.approvalObj.approveProcessId,
            approveLevel: this.approvalObj.approveLevel,
            updateUser: this.approvalObj.updateUser,
            approveId: this.approvalObj.approveId
          }];
        }
        this.updateApproveRecord(data);
      },
      async updateApproveRecord(obj) {
        const {
          code,
          data,
        } = await API.updateApproveRecord(obj);
        if (code == '0000') {
          this.ifthrough = false;
          this.$message('操作成功。');
        }
      },
      dateFormatting(a) {
        if (a) {
          let value = new Date(a);
          return value.getFullYear() + '-' + (value.getMonth() * 1 + 1) + '-' + value.getDate();
        }
      },
      async getApproveRecordList() { //审批
        let obj = {};
        obj = {
          "approveStatus": this.type,
          "searchCondition": this.searchText,
          "pn": this.pn,
          "ps": this.ps
        }
        this.boxTableData = [];
        const {
          code,
          data,
        } = await API.approveRecordList(obj);
        if (code == '0000') {
          if (data.list) {
            let list = data.list;
            list.forEach(a => {
              let type = (a.documentType == 1) ? '送审' : '借阅';
              let icon = (a.approveStatus == 0) ? daisp : yisp;
              this.boxTableData.push({
                approveStatus: a.approveStatus,
                approveType: a.documentType,
                approveProcessId: a.approveProcessId,
                approveLevel: a.approveLevel,
                updateUser: a.applyName,
                approveId: a.approveRecordId,
                documentCode: a.documentCode,
                icon: icon,
                title: a.documentName,
                code: '单据编号：' + a.documentCode,
                type: '单据类别：' + type,
                time:  this.dateFormatting(a.createTime),//'申请时间：' +
                person: '申请人：' + a.applyName
              })
            });
          }
        }
      },
    }
  }
</script>
<style lang="less">
  .dataShow {
    height: 100%;

    .flex {
      display: -webkit-flex;
      /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
      display: -moz-flex;
      /* Firefox 18+ */
      display: -ms-flexbox;
      /* IE 10 */
      display: flex;
      /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
    }

    .flex-wrap {
      -webkit-flex-wrap: wrap;
      -moz-flex-wrap: wrap;
      flex-wrap: wrap;
    }

    .flex-direction {
      flex-direction: row;
      -webkit-flex-direction: row;
    }

    .flex-direction-column {
      flex-direction: column;
      -webkit-flex-direction: column;
    }

    .justify-content {
      -webkit-justify-content: space-between;
      justify-content: space-between;
    }

    .justify-content-center {
      -webkit-justify-content: center;
      justify-content: center;
    }

    .align-items-center {
      align-items: center;
    }

    .align-items-end {
      align-items: flex-end;
    }

    .align-items-baseline {
      align-items: baseline;
    }

    .base-data .item {
      height: 2rem;
      margin: 10px 5px 5px 5px;
      background: #1A2833;
      border: 1px #48596D solid;
    }

    .grad {
      background: -webkit-linear-gradient(#29D9C2, #1E68E4);
      /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(#29D9C2, #1E68E4);
      /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(#29D9C2, #1E68E4);
      /* Firefox 3.6 - 15 */
      background: linear-gradient(#29D9C2, #1E68E4);
      /* 标准的语法 */
    }

    .swiper-slide {
      height: auto;
    }
  }
</style>
