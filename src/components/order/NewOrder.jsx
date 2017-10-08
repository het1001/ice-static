import React from 'react';
import {Menu, Icon} from 'antd';

const NewOrder = React.createClass({
	getInitialState() {
		return {
			current: '1',
		};
	},
	changePage(key) {
		console.log('change', key);
	},

	render() {
		return (
			<div>
				新订单
			</div>
		);
	},
});

export default NewOrder;
