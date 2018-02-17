import React from 'react';

Date.prototype.Format = function (fmt) { //author: meizz
	var o = {
		'M+': this.getMonth() + 1, //月份
		'd+': this.getDate(), //日
		'h+': this.getHours(), //小时
		'm+': this.getMinutes(), //分
		's+': this.getSeconds(), //秒
		'q+': Math.floor((this.getMonth() + 3) / 3), //季度
		'S': this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
	return fmt;
}

const CommonUtil = {
	pareDate: (time, format) => {
		if (!time) {
			return time;
		}

		if (!format) {
			format = 'yyyy-MM-dd hh:mm:ss';
		}

		return new Date(time).Format(format);
	},

	pareDate2: (time) => {
		return new Date(time).Format('yyyy-MM-dd');
	},

	onInputChange(key, e) {
		this.state[key] = e.target.value;
		this.setState({});
	},

	onSelectChange(key, e) {
		this.state[key] = e;
		this.setState({});
	},
}

export default CommonUtil;
