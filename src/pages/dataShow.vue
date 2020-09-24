<template>
  <div class="dataShow">
    <div id="top">
      <div class="flex">
        <div class="flex flex-direction align-items-center">
          <img src="../assets/img/app_btn_back.png" style="height: 18px;margin:0 10px 0 10px" @click="backFun">
        </div>
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="searchText" @input="searchTextFun" style="width: 100%;margin-right: 30px;">
        </el-input>
      </div>
    </div>
    <div class="swiper-container" id="page">
      <div class="swiper-wrapper">
        <!-- 我的文件-->
        <div class="swiper-slide slidepage">
          <template v-if="fileList&&fileList.length>0">
            <div style="background: #fff;text-align: left;margin-top: 0.3rem;padding-left: 0.2rem;">
              <el-row :gutter="20" v-for="(item, index) in fileList||[]" :key="index" style="height: 1.4rem;border-bottom: 1px solid #ededed;">
                <el-col :span="2" style="line-height: 1.4rem;">
                  <img :src="item.icon" style="height: 0.5rem;margin:0 0.1rem">
                </el-col>
                <el-col :span="22">
                  <div class="titleElipse" style="margin-top: 0.14rem;width: calc(100% - 0.1rem);height: 0.5rem;text-overflow: ellipsis;">
                    {{item.fileName}}
                  </div>
                  <div style="margin-top: 0.2rem;color: #ccc;font-size: 12px;">
                    {{item.createDate|dateFormatting}} &nbsp;&nbsp;
                    {{item.dirName}}&nbsp;&nbsp;
                    {{item.fileSize}}kb
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
            <el-button type="text" @click="type='3';getApproveRecordList();" class="bottomBorder">全部</el-button>
            <el-button type="text" @click="type='1';getApproveRecordList();" class="bottomBorder">待审批单据</el-button>
            <el-button type="text" @click="type='2';getApproveRecordList();" class="bottomBorder">已审批单据</el-button>
          </div>
          <template v-if="boxTableData&&boxTableData.length>0">
            <div style="background: #fff;text-align: left;margin-top: 1.5rem;padding-bottom:1px ;">
              <el-row :gutter="2" style="line-height: 0.4rem;border-bottom: 1px solid #ededed;clear: both;">
                <el-col :span="5">
                  <el-checkbox v-model="checkedall" @change="checkedallFun" style="line-height: 0.6rem;margin:0 0.1rem">全选</el-checkbox>
                </el-col>
                <el-col :span="10" v-if="type=='1'">
                  <el-button type="text" size="mini" @click="ifthroughtitle='批量审批通过';showDialog()">批量通过</el-button>
                  <el-button type="text" size="mini" @click="ifthroughtitle='批量审批退回';showDialog()">批量退回</el-button>
                </el-col>
              </el-row>
              <el-row :gutter="20" v-for="(item, index) in boxTableData||[]" :key="index" style="clear: both;height: 1.9rem;border-bottom: 1px solid #ededed;">
                <el-col :span="3" :style="{'line-height':'1.9rem'}">
                  <el-checkbox v-model="item.checked" style="height: 0.5rem;margin-left:0.1rem"></el-checkbox>
                </el-col>
                <el-col :span="15">
                  <div style="margin-top: 0.1rem;height: 0.4rem;" class="titleElipse">
                    {{item.title}}
                  </div>
                  <div style="margin-top: 0.2rem;color: #ccc;font-size: 12px;">
                    <span style="margin-right: 0rem;"> {{item.code}}</span>
                  </div>
                  <div style="margin-top: 0.2rem;color: #ccc;font-size: 12px;">
                    <span style="margin-right: 0.2rem;"> {{item.type}} </span>
                    {{item.person}}
                  </div>
                </el-col>
                <el-col :span="6">
                  <div style="margin-top: 0.2rem;color: #ccc;font-size: 12px;">
                    {{item.time}}
                  </div>
                  <template v-if="type=='1'">
                    <el-button type="text" size="mini" @click="approvalObj=item;ifthroughtitle='审批通过';ifthrough=true">通过</el-button>
                    <el-button type="text" size="mini" @click="approvalObj=item;ifthroughtitle='审批退回';ifthrough=true">退回</el-button>
                  </template>
                  <div class="spbg" :style="{'background-image':'url('+item.icon+')'}"></div>

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
            <div style="background: #fff;text-align: left;margin-top: 0.3rem;padding-left: 0.2rem;padding-bottom: 1px;">
              <el-row :gutter="20" v-for="(item, index) in allmsg||[]" :key="index" style="height: 1.8rem;border-bottom: 1px solid #ededed;">
                <el-col :span="3" style="line-height: 1.8rem;">
                  <img :src="item.icon" style="height: 0.8rem;margin-left:0.1rem">
                </el-col>
                <el-col :span="14">
                  <div style="margin-top: 0.14rem;" class="titleElipse">
                    {{item.title}}
                  </div>
                  <div style="margin-top: 0.1rem;color: #ccc;font-size:12px;overflow: hidden;">
                    {{item.content}}
                  </div>
                </el-col>
                <el-col :span="6" style="color: #ccc;font-size: 12px;margin-top: 0.2rem;">
                  {{item.time}}
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
          <div class="swiper-slide" @click="appFileListByCondition()">
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

  import doc from '@/assets/img/doc.png';
  import docx from '@/assets/img/docx.png';
  import jpg from '@/assets/img/jpg.png';
  import png from '@/assets/img/png.png';
  import xls from '@/assets/img/xls.png';
  import xlsx from '@/assets/img/xlsx.png';
  import ppt from '@/assets/img/ppt.png';
  import pptx from '@/assets/img/pptx.png';
  import pdf from '@/assets/img/pdf.png';
  import txt from '@/assets/img/txt.png';
  import {
    swiperFun
  } from './swiper.js'
  import API from '@/assets/js/api.js';
  export default {
    props: {},
    data() {
      return {
        searchText: null,
        fileList: [],
        boxTableData: [],
        pn: 1,
        ps: 20,
        type: '3',
        searchText: '',
        allmsg: [],
        checkedall: false,
        ifthrough: false,
        ifthroughtitle: '审批通过',
        approvalObj: null,
      };
    },
    filters: {
      dateFormatting(a) {
        if (a) {
          let value = new Date(a);
          return value.getFullYear() + '-' + (value.getMonth() * 1 + 1) + '-' + value.getDate();
        }
      }
    },
    mounted() {
      swiperFun();
      this.appFileListByCondition();
      this.getApproveRecordList();
      this.getmsgFun();
    },
    methods: {
      backFun() {
        this.$router.push('/');
      },
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
      searchTextFun() {
        let that = this;
        setTimeout(() => {
          that.appFileListByCondition();
          that.getApproveRecordList();
          that.getmsgFun();
        }, 600)
      },
      async appFileListByCondition() {
        const {
          code,
          data,
        } = await API.appFileListByCondition({
          fileName: this.searchText
        });
        if (code == '0000') {
          this.fileList = data;
          this.fileList.forEach(a => {
            if (a.fileTypeName == 'txt') {
              a.icon = txt
            } else if (a.fileTypeName == 'pdf') {
              a.icon = pdf
            } else if (a.fileTypeName == 'ppt') {
              a.icon = ppt
            } else if (a.fileTypeName == 'pptx') {
              a.icon = pptx
            } else if (a.fileTypeName == 'doc') {
              a.icon = doc
            } else if (a.fileTypeName == 'xls') {
              a.icon = xls
            } else if (a.fileTypeName == 'xlsx') {
              a.icon = xlsx
            } else if (a.fileTypeName == 'jpg') {
              a.icon = jpg
            } else if (a.fileTypeName == 'png') {
              a.icon = png
            } else if (a.fileTypeName == 'docx') {
              a.icon = docx
            }
          });
        }
      },
      async getmsgFun() {
        let time = this.dateFormatting(new Date());
        this.allmsg = [];
        const {
          code,
          data,
        } = await API.remindbasicinfo({
          document_code: this.searchText
        });
        if (code == '0000') {
          data.borrow.forEach(a => {
            this.allmsg.push({
              time: time,
              icon: daoqi,
              title: '借阅到期提醒',
              content: '文档编号：' + a.document_code + '借阅截止时间还有三小时，请及时处理'
            })
          });
          data.approve.forEach(a => {
            let status = (a.approve_type == 1) ? '正在送审...' : '正在借阅...';
            this.allmsg.push({
              time: time,
              icon: spicon,
              title: '审批提醒',
              content: '文档编号：' + a.document_code + '' + status + '请您审批'
            })
          });
          data.expire.forEach(a => {
            let title = (a.approve_type == 1) ? '送审审批提醒' : '借阅审批提醒';
            let status = (a.approve_status == 1) ? '审批成功' : '审批失败';
            this.allmsg.push({
              time: time,
              icon: tixing,
              title: title,
              content: '文档编号：' + a.document_code + '已经' + status
            })
          });
        }
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
                time: this.dateFormatting(a.createTime), //'申请时间：' +
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

    .bottomBorder:hover {
      border-bottom: 3px solid deepskyblue;
    }

    .titleElipse {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }

    .spbg {
      height: 25px;
      width: 25px;
      background-repeat: no-repeat;
      background-position: top;
      background-size: 100% 100%;
      background-clip: content-box;
    }

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
