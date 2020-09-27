// 项目中的公共方法
import { Notification, Message} from 'element-ui'
import Cookies from 'js-cookie'
import download from 'downloadjs'
import axios from "axios";
import { degrees, PDFDocument, rgb, StandardFonts } from "pdf-lib";
const mime = require('mime');
const TokenKey = 'yunNan_Token'
// const fileLocation =process.env.NODE_ENV === 'development'?'/ftp/':'/home/webfile/';
const fileLocation ='/ftp/';
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function loadScript(url, callback) {
  // 动态加载js方法
  let script = document.createElement('script');
  script.type = 'text/javascript';
  if (script.readyState) {
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        if (callback) callback();
      }
    };
  } else {
    script.onload = function () {
      if (callback) callback();
    };
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}
/**
 * 将数组转化成树结构 array to tree
 * @param {*} array 数据源
 * @param {*} options 字段名配置项
 */
export function arrayToTree(
  array = [],
  options = { id: "id", pid: "pid", children: "children" },
) {
  let array_ = []; // 创建储存剔除叶子节点后的骨架节点数组
  let unique = {}; // 创建盒子辅助本轮children合并去重
  let root_pid = [
    0,
    "0",
    undefined,
    "undefined",
    null,
    "null",
    "00000000-0000-0000-0000-000000000000"
  ]; // 可能存在的根节点pid形式
  array.forEach(item => {
    // 筛选可以插入当前节点的所有子节点
    let children_array = array.filter(
      it => it[options.pid] === item[options.id]
    );
    if (item[options.children] && item[options.children] instanceof Array && item[options.children].length > 0) {
      // 去重合并数组
      item[options.children].map(i => (unique[i[options.id]] = 1));
      item[options.children].push(
        ...children_array.filter(i => unique[i[options.id]] !== 1)
      );
    } else {
      item[options.children] = children_array;
    }
    // 当children_array有数据时插入下一轮array_，当无数据时将最后留下来的根节点树形插入数组
    let has_children = children_array.length > 0;
    if (
      has_children ||
      (!has_children && root_pid.includes(item[options.pid]))
    ) {
      array_.push(item);
    }
  });
  // 当数组内仅有根节点时退出，否组继续处理 最终递归深度次
  if (!array_.every(item => root_pid.includes(item[options.pid]))) {
    return arrayToTree(array_, options);
  } else {
    return array_;
  }
}
export  function elementUpSize(limit) {
  // 上传组件大小计算
    var size = "";  
    if( limit < 0.1 * 1024 ){ //如果小于0.1KB转化成B  
        size = limit.toFixed(2) + "B";    
    }else if(limit < 0.1 * 1024 * 1024 ){//如果小于0.1MB转化成KB  
        size = (limit / 1024).toFixed(2) + "KB";              
    }else if(limit < 0.1 * 1024 * 1024 * 1024){ //如果小于0.1GB转化成MB  
        size = (limit / (1024 * 1024)).toFixed(2) + "MB";  
    }else{ //其他转化成GB  
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";  
    }   
    var sizestr = size + "";   
    var len = sizestr.indexOf("\.");  
    var dec = sizestr.substr(len + 1, 2);  
    if(dec == "00"){//当小数点后为00时 去掉小数部分  
        return sizestr.substring(0,len) + sizestr.substr(len + 3,2);  
    }  
    return sizestr;
}
export function formaterFileSize(Size, upload) {
  const _GB = 1024 * 1024;
    if (Size === null) return "-";
    if (Size < 1024) {
      // 1024以下显示kb
      return Size + "KB";
    }
    if (Size < _GB) {
      // 1024*1024
      let _mb = (Size / 1024).toFixed(2);
      return parseFloat(_mb) + "MB";
    }
    let _gb = (Size / _GB).toFixed(2);
    return parseFloat(_gb) + "GB";
}
export function splicParentsUntil(data, coordinate, options = {
  pathName: 'name', // 所要拼接字段
  pathConnector: '\\', // 连接符 
  pathId: "id", // 数据源匹配字段 
  pathParents: "parents",
  pathIdentityId: "identityId",
}) {
  let coordinate_item = data.find(i => i[options.pathId] === coordinate[options.pathId]);
  if (!coordinate_item) return '';
  if (!coordinate_item[options.pathParents]) return coordinate_item[options.pathName];
  let _parents = coordinate_item[options.pathParents]
    .substring(1, coordinate_item[options.pathParents].length - 1)
    .split(",")
    .filter(i => !!i);
  let splic_parents = '';
  _parents.forEach(i => {
    let _parent = data.find(t => t[options.pathIdentityId] == i);
    splic_parents += `${_parent[options.pathName]}${options.pathConnector}`
  })
  return splic_parents + coordinate_item[options.pathName];
}

export function pritfNeedParamsChange(typestr) {
  // typestr 有可能是各种比如 png, word，excel,用来调用打印接口的
  let acceptStr = typestr.toLowerCase()
  let obj = {
    "xls": '0',
    "xlsx": '0',
    "csv": '0',
    "doc": '1',
    "docx": '1',
    "pdf": '2',
    "bmp": '3',
    "jpg": '3',
    "jpeg": '3',
    "png": '3',
    "txt": '4',
    "ppt": '5',
    "pptx": '5'
  }
  return obj[acceptStr]
}
export function submissionStatusDict(typestr) {
  // 审核状态字典值
  let obj = {
    '0':'待送审',
    '1':'送审中',
    '2':'已送审'
  }
  return obj[typestr]
}
export function toBase64(str) {
  //  转base64
  var res = new Buffer(str)
  return res.toString('base64')
};
export function base64To(str) {
  // base64解码
  var b = new Buffer(str, 'base64')
  return b.toString();
}
/**
 * fileId  文件id
 * fileTypeName 文件后缀名
 * fileFrom  文件来源于1文件列表，还是版本列表2，还是模版列表3，区分有无父级目录
 * directorId  父级目录id , 没有的话可以不传
 * filePath 文件存在的ftp目录
 */
export function previewMethods(fileId, fileTypeName, fileFrom, directorId='module', filePath) {
  if(fileTypeName.toLowerCase() === 'pdf') {
    // 如果是pdf格式的，打开pdf预览组件
    window.open(`/commonViewPDF/${directorId}/${toBase64(filePath)}`, "_blank")
  }
}
/**
 * 接口直接下载文件，没有进度条
 * fileRes  接口返回的流
 * fileName 文件名称
 */
export function DownBlobMethods(fileRes, fileName) {
  // 公共下载方法
  const strMimeType = mime.getType(fileName);
  console.log(fileName)
  console.log(fileRes)
  console.log(strMimeType)
  let blob = new Blob([fileRes] , {
    'type': strMimeType
  })
  download(blob, fileName, strMimeType);
}
/**
 * 接口根据文件地址直接下载文件
 */
export async function  DownPathMethods(filePath, fileName, type) {
  console.log('执行下载')
  // 公共无水印pdf下载方法
  Notification({
    title: '正在下载',
    message: fileName,
    duration:0,
    position: 'bottom-right'
  });
  let pathSplice = filePath.split('/');
  let pathLength = pathSplice.length;
  let url = fileLocation + pathSplice[pathLength - 1];
  console.log(url)
  const existingPdfBytes = await fetch(url).then((res) =>
      res.arrayBuffer()
    );
    let pdfDoc = await PDFDocument.load(existingPdfBytes);
    if(type == 1) {
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pages = pdfDoc.getPages();
      pages.map(item => {
        const {width, height} = item.getSize();
        item.drawText("this is waterMaker", {
          x: 5,
          y: height / 2 + 300,
          size: 30,
          font: helveticaFont,
          // color: rgb(216,191,216),
          rotate: degrees(-45),
        });
      })
    } else{

    }
    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, fileName,  "application/pdf")
    Notification.closeAll()
}

export function isCanPreView(str) {
  if(str.toLowerCase() === 'pdf' || str.toLowerCase() === 'png' || str.toLowerCase() === 'jpg' || str.toLowerCase() === 'jpeg') {
    return true
  } else {
    return false;
  }
}
export function splitPath(filePath) {
  // 根据地址获取，ftp的地址
  let pathSplice = filePath.split('/');
  let pathLength = pathSplice.length;
  let url = fileLocation + pathSplice[pathLength - 1];
  return url
}

export function commonDownloadfile(downloadType, downloadFileId, fileName) {
  axios({
    method: "post",
    headers: {
      "Content-Type": "application/json",
      "token": sessionStorage.getItem("token")
    },
    url: "/api/FileDownload/downloadFile",
    responseType: "blob",
    data: {
      downloadType: downloadType,
      fileId: downloadFileId,
    },
    onDownloadProgress:  (progressEvent) => {
      // 对原生进度事件的处理
      let progressLoade = Math.floor(progressEvent.loaded / progressEvent.total * 100);
      console.log(progressLoade)
    },
  }).then((res) => {
    // response 中还有一层data ,如果直接用blob流，文件里面是object
    console.log(res)
      if (!res.data) {
        return false;
      }
      let blob = res.data;
      console.log(blob)
      if ("download" in document.createElement("a")) {
        // 不是IE浏览器
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 下载完成移除元素
        window.URL.revokeObjectURL(url); // 释放掉blob对象
      } else {
        // IE 10+
        window.navigator.msSaveBlob(blob, fileName);
      }
  }).catch(err => {
    Message.error(err);
  })
}
export function printContent(content){
  var tagElements = document.getElementsByTagName('iframe');
   for (var m = 0; m < tagElements.length; m++) {
       if (tagElements[m].className === 'tmp-pdf') {
           tagElements[m].parentNode.removeChild(tagElements[m]);//去除元素
       }
   }
   const iframe = document.createElement('iframe')
   iframe.className = 'tmp-pdf';
   iframe.style.display = 'none'
   iframe.src = URL.createObjectURL(content)
   document.body.appendChild(iframe)
   setTimeout(function(){
     iframe.contentWindow.print()
     URL.revokeObjectURL(content)
   },100)
}