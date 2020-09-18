import {
  fetch
} from './http';
// request payload形式的参数需要配置，headers的content-Type: application/json,
// 如果不配置默认是form Data形式
// const development = 'http://localhost:3618';
const development = '/api';
const API = (url, method, config) => params => fetch(development + url, params, method || 'post', config || {});
export default {
  loginAction: API('/user/login', 'post', {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  remindbasicinfo: API('/remind/remindbasicinfo', 'post', {
    headers: {
      'Content-Type': 'application/json'
    }
  }), //消息通知
  getAllFieldType: API('/table/getAllFieldType', 'get', {
    headers: {}
  }), //获取表单字段控件的类型
  /* 审批管理 */
  approveRecordList: API('/approveRecord/approveRecordList', 'post', {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  approveOwnRecordList: API('/approveRecord/approveOwnRecordList', 'post', {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  updateApproveRecord: API('/approveRecord/updateApproveRecord', 'post', {
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  queryApproveRecordDetail: API('/approveRecord/queryApproveRecordDetail', 'get', {}),
};
