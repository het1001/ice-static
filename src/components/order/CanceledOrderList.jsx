import React from 'react';
import {Tag, Table, message, Popconfirm} from 'antd';
import Ajax from '../../util/Ajax';
import CommonUtil from '../../util/CommonUtil';

class NewOrderList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			pagination: {
				current: 1,
				total: 0,
			},
			phone: '',
			state: '',
			loading: true
		};

		this.fetch = this.fetch.bind(this);
		this.handleTableChange = this.handleTableChange.bind(this);
	}

	componentWillMount() {
		this.fetch();
	}

	fetch() {
		this.setState({
			loading: true
		});

		Ajax({
			url: '/ice/pc/order/queryList.json',
			param: {
				state: 'CANCELED',
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
	}

	handleTableChange(pagination, filters, sorter) {
		const pager = this.state.pagination;
		pager.current = pagination.current;
		this.setState({
			pagination: pager,
		}, () => {
			this.fetch();
		});
	}

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
			}];

		return (
			<div>
				<div style={{padding: 10}}>
					<Tag color="#f50" >取消的订单</Tag>
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
	}
};

export default NewOrderList;
