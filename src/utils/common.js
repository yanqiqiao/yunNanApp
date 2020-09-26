export default{
    install:function(Vue,opt){
        Vue.prototype.COMMON = {
        	
        }
        //判断数组中是否存在字符串
        Vue.prototype.subButtonShow = function(val){
            let sbuBtnStr = localStorage.subBtn;//按钮数组
            let sbuArr = val.split(',');
            let i = 0;
            sbuArr.forEach(item => {
                if(sbuBtnStr.indexOf(item)>-1){
                    i++
                }
            });
            if(i>0)
                return true;
                return false;
        }
		//生成订单编号
		Vue.prototype.orderNumber = function() {
			var date = new Date();
			let Y = date.getFullYear();
			let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
			let D = ((date.getDate()<10) ? '0'+date.getDate():date.getDate());
			return  "ZLD"+Y+M+D + (Math.round(Math.random() * 89 + 100)).toString();
		}
        //判断是否为空
        Vue.prototype.ifNull = function(v){
            if(v==undefined||v=='undefined'||v ==''||v==null)
                return true;
            return false;
        }
        //时间转换时间戳
        Vue.prototype.timeToTimestamp = function(val){
            var date = new Date(val);
            var timestamp = date.getTime();
            return timestamp;
        }
        //时间戳转换为时间
        Vue.prototype.changeDate = function(datetimes){
            var date = new Date(datetimes);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = ((date.getDate()<10) ? '0'+date.getDate():date.getDate()) + ' ';
            let h = ((date.getHours()<10) ? '0'+date.getHours():date.getHours()) + ':';
            let m = ((date.getMinutes()<10) ? '0'+date.getMinutes():date.getMinutes()) + ':';
            let s = ((date.getSeconds()<10) ? '0'+date.getSeconds():date.getSeconds());
       // 年 月 日 时 分 秒
            return Y+M+D+h+m+s;
        }
           //时间插件
        Vue.prototype.changeDateFormat = function(datetimes){
            var date = new Date(datetimes);
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
            let D = ((date.getDate()<10) ? '0'+date.getDate():date.getDate());
            
       // 年 月 日 时 分 秒
            return Y+M+D;
        }
		     //时间插件
		 Vue.prototype.todayDate = function(){
		     var date = new Date();
		     let Y = date.getFullYear() + '-';
		     let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
		     let D = ((date.getDate()<10) ? '0'+date.getDate():date.getDate());
		     
		// 年 月 日 时 分 秒
		     return Y+M+D;
		 }
    }
}
