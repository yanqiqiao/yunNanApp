import Vue from 'vue';
import axios from 'axios';
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(config => {
		// 判断是否存在token，如果存在的话，则每个http header都加上token 用于将来的身份验证
		let token = sessionStorage.token;
		if (token) {
			config.headers['token'] = token;
		}
		return config;
	},
	err => {
		return Promise.reject(err);
	});
export const fetch = (url, params, method, config) => {
	if (!params) {
		params = {};
	}
	return new Promise((resolve, reject) => {
		let param, ajx;
		if (config && config.headers && config.headers['Content-Type'] === 'application/json') {
			param = params;
		} else {
			param = stringify(params);
		}
		if (method === 'get') {
			if (param) {
				ajx = axios.get(url + '?' + param, config)
			} else {
				ajx = axios.get(url, config)
			}
		} else if (method === 'delete') {
			params.user_id = '222';
			ajx = axios.delete(url, param, config);
		} else if (method === 'put') {
			ajx = axios.put(url, param, config);
		} else {
			ajx = axios.post(url, param, config);
		}
		ajx.then(res => {
			if (res.status === 200) {
				if (res.data.code == '1001' || res.data.code == '1002' || res.data.code == '1003') { //token失效
					location.href = '/';
				} else {
					resolve(res.data);
				}
			} else {
				if (res.data.error.errCode === 600) {
					// 登陆信息不完整
					location.href = '/';
				} else {
					resolve(res.data);
				}
			}
		}).catch((err) => {
			reject(err)
			//errorHandle(err);
		});
	});
};

// 将application/json参数格式 转换为application/x-www-form-urlencoded方式
function stringify(obj) {
	let str = '';
	for (let k in obj) {
		str += (k + '=' + obj[k] + '&');
	}
	return str.substring(0, str.length - 1);
};

function errorHandle() {
	// 处理接口错误
}
