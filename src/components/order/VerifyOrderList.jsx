import React from 'react';
import {Tag, Table, message, Popconfirm} from 'antd';
import Ajax from '../../util/Ajax';
import CommonUtil from '../../util/CommonUtil';

const NewOrderList = React.createClass({
	getInitialState() {
		return {
			data: [],
			pagination: {
				current: 1,
				total: 0,
			},
			loading: true
		};
	},
	componentWillMount() {
		this.fetch();
	},
	fetch() {
		this.setState({
			loading: true
		});

		Ajax({
			url: '/ice/pc/order/queryList.json',
			param: {
				state: 'ACCEPT',
				pageNum: this.state.pagination.current,
				pageSize: 10
			},
			callback: (result) => {
				if (result.success) {
					let page = this.state.pagination;
					page.total = result.total;
					this.setState({
						data: result.data.map((item) => {
							item.key = item.id;
							return item;
						}),
						pagination: page,
						loading: false
					});
				} else {
					message.error(result.errorMsg);
				}
			},
		});
	},

	handleTableChange(pagination, filters, sorter) {
		const pager = this.state.pagination;
		pager.current = pagination.current;
		this.setState({
			pagination: pager,
		}, () => {
			this.fetch();
		});
	},

	onComplete(record) {
		Ajax({
			url: '/ice/pc/order/complete.json',
			method: 'post',
			param: {
				id: record.id
			},
			callback: (result) => {
				if (result.success) {
					message.success('操作成功');
					this.fetch();
				} else {

				}
			},
		});
	},

	onCancel(record) {
		Ajax({
			url: '/ice/pc/order/cancel.json',
			method: 'post',
			param: {
				id: record.id
			},
			callback: (result) => {
				if (result.success) {
					message.success('取消成功');
					this.fetch();
				} else {

				}
			},
		});
	},

	render() {
		const expandedRowRender = (data) => {
			const columns = [
				{ title: '商品', dataIndex: 'comName', key: 'comName' },
				{ title: '规格（支/件）', dataIndex: 'comStandard', key: 'comStandard' },
				{ title: '数量', dataIndex: 'comNum', key: 'comNum' },
				{ title: '价格（元）', dataIndex: 'comPrice', key: 'comPrice' }
			];

			return (
				<Table
					columns={columns}
					dataSource={data.orderLists}
					pagination={false}
				/>
			);
		};

		const columns = [
			{
				title: '序号',
				width: '5%',
				dataIndex: 'id',
			}, {
				title: '订单号',
				width: '195px',
				dataIndex: 'orderNum',
			}, {
				title: '创建时间',
				width: '140px',
				dataIndex: 'createTime',
				render: (text, record) => (
					<span>
            {CommonUtil.pareDate(text)}
          </span>
				),
			}, {
				title: '总价（元）',
				dataIndex: 'priceTotal',
			}, {
				title: '手机号',
				width: '95px',
				dataIndex: 'phone',
			}, {
				title: '姓名',
				dataIndex: 'userName',
			}, {
				title: '地址',
				dataIndex: 'address',
			}, {
				title: '操作',
				width: '140px',
				render: (text, record) => (
					<span>
						<Popconfirm title="确定完成吗?" onConfirm={this.onComplete.bind(this, record)}
												okText="是" cancelText="否">
									<a>订单完成</a>
								</Popconfirm>
						<span className="ant-divider"/>
						<Popconfirm title="确定要取消吗?" onConfirm={this.onCancel.bind(this, record)}
												okText="是" cancelText="否">
									<a>取消</a>
								</Popconfirm>
					</span>
				),
			}];

		return (
			<div>
				<div style={{padding: 10}}>
					<Tag color="#108ee9" >确认的订单</Tag>
				</div>
				<Table
					columns={columns}
					dataSource={this.state.data}
					pagination={this.state.pagination}
					loading={this.state.loading}
					expandedRowRender={expandedRowRender}
					onChange={this.handleTableChange}
					bordered/>
			</div>
		);
	},
});

export default NewOrderList;
