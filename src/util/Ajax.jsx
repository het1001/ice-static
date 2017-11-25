import React from 'react';
import request from 'superagent';
import {notification, Button} from 'antd';

const reLogin = () => {
	window.location.href = '/ice/pc/login.htm?hash=' + (window.location.hash ? window.location.hash.substr(1) : '');
};

const reLoginNotifi = () => {
	notification.warning({
		message: '认证失败',
		description: '长时间未操作，认证信息作废。需重新登录，以认证身份！',
		btn: (<Button type="primary" size="small" onClick={reLogin}>
			重新登录
		</Button>),
		duration: null
	});
};

const Ajax = function (data) {

	data.param = data.param || {};
	data.method = data.method || 'get';

	if (data.method.toLowerCase() === 'get') {
		request
			.get(data.url)
			.query(data.param)
			.end(function (err, res) {
				if (err) {
					console.error(err);
				}

				if (res.body) {
					data.callback(res.body);
				} else {
					if (res.status === 200) {
						reLoginNotifi();
					}
				}
			});
	} else {
		data.contentType = data.contentType || 'application/json';

		request
			.post(data.url)
			.send(data.param)
			.set('Content-Type', data.contentType)
			.set('Accept', 'application/json')
			.end(function (err, res) {
				if (err) {
					console.error(err);
				}

				if (res.body) {
					data.callback(res.body);
				} else {
					if (res.status === 200) {
						reLoginNotifi();
					}
				}
			});
	}
};

export default Ajax;
