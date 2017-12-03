import React from 'react';
import {Table, Icon, Button, Popconfirm, message} from 'antd';
import Ajax from '../../util/Ajax';
import SearchBar from './SearchBar';

import CommodityDialog from './CommodityDialog';

const CommodityList = React.createClass({
	getInitialState() {
		return {
			data: [],
			pagination: {
				current: 1,
				total: 0,
			},
			name: '',
			brand: '',
			status: '',
			catId: 0,
			loading: true,
			com: {},
			catData: []
		};
	},
	componentWillMount() {
		this.fetch();

		Ajax({
			url: '/ice/pc/cat/queryList.json',
			param: {},
			callback: (result) => {
				if (result.success) {
					this.setState({
						catData: result.data
					});
				} else { }
			},
		});
	},
	fetch() {
		this.setState({
			loading: true
		});

		Ajax({
			url: '/ice/pc/commodity/queryList.json',
			param: {
				name: this.state.name,
				brand: this.state.brand,
				status: this.state.status,
				catId: this.state.catId,
				pageNum: this.state.pagination.current,
				pageSize: 10
			},
			callback: (result) => {
				if (result.success) {
					let page = this.state.pagination;
					page.total = result.total;
					this.setState({
						data: result.data.map((com) => {
							com.key = com.id;
							return com;
						}),
						pagination: page,
						loading: false
					});
				} else {

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

	handleSearch(search) {
		if (search) {
			const page = this.state.pagination;
			page.current = 1;

			this.setState({
				name: search.name,
				brand: search.brand,
				status: search.status,
				catId: search.catId,
				pagination: page,
			}, this.fetch);
		} else {
			this.fetch();
		}
	},

	editCom(record) {
		this.setState({
			com: record
		}, () => {
			this.refs.commodityDialog.showModal();
		});
	},

	onlineCom(record) {
		Ajax({
			url: '/ice/pc/commodity/online.json',
			method: 'post',
			param: {
				id: record.id
			},
			callback: (result) => {
				if (result.success) {
					message.success('上线成功');
					this.fetch();
				} else {

				}
			},
		});
	},

	offlineCom(record) {
		Ajax({
			url: '/ice/pc/commodity/offline.json',
			method: 'post',
			param: {
				id: record.id
			},
			callback: (result) => {
				if (result.success) {
					message.success('下线成功');
					this.fetch();
				} else {

				}
			},
		});
	},

	render() {
		const columns = [
			{
				title: '序号',
				width: '3%',
				dataIndex: 'id',
			}, {
				title: '名称',
				width: '7%',
				dataIndex: 'name',
				render: (text, record) => (
					(record.state === 0) ? <span><Icon type="cloud-o" style={{color: 'red'}}/> {text}</span>
						:
						<span><Icon type="cloud-upload" style={{color: 'green'}}/> {text}</span>
				),
			}, {
				title: '厂家/品牌',
				width: '5%',
				dataIndex: 'brand',
			}, {
				title: '规格/件',
				width: '5%',
				dataIndex: 'standardPice',
			}, {
				title: '上柜价（元）',
				children: [{
					title: '件',
					width: '5%',
					dataIndex: 'pricePi',
				}, {
					title: '支',
					width: '5%',
					dataIndex: 'priceBr',
				}]
			}, {
				title: '零售价（元）',
				children: [{
					title: '支',
					width: '5%',
					dataIndex: 'retailPriceBr',
				}]
			}, {
				title: '终端利润（元）',
				children: [{
					title: '件',
					width: '5%',
					dataIndex: 'profitPi',
				}, {
					title: '支',
					width: '5%',
					dataIndex: 'profitBr',
				}]
			}, {
				title: '库存（件）',
				width: '5%',
				dataIndex: 'total',
				render: (text, record) => (
					(text > 50) ? <span style={{color: 'green', fontWeight: 'bold'}}>{text}</span>
						:
						<span style={{color: 'red', fontWeight: 'bold'}}>{text}</span>
				),
			}, {
				title: '销量（件）',
				width: '5%',
				dataIndex: 'sales',
			}, {
				title: '操作',
				width: '7%',
				render: (text, record) => (
					<span>
                        <a href="#commodity_list" onClick={this.editCom.bind(this, record)}>编辑</a>
                        <span className="ant-divider"/>
						{
							record.state === 0 ?
								<Popconfirm title="确定要上线吗?" onConfirm={this.onlineCom.bind(this, record)} okText="是"
														cancelText="否">
									<a href="#commodity_list">上线 <Icon type="arrow-up"/></a>
								</Popconfirm>
								:
								<Popconfirm title="确定要下线吗?" onConfirm={this.offlineCom.bind(this, record)} okText="是"
														cancelText="否">
									<a href="#commodity_list"><Icon type="arrow-down"/></a>
								</Popconfirm>
						}
                    </span>
				),
			}];

		return (
			<div>
				<Table
					title={() => <SearchBar catData={this.state.catData} callback={this.handleSearch}/>}
					columns={columns}
					dataSource={this.state.data}
					pagination={this.state.pagination}
					loading={this.state.loading}
					onChange={this.handleTableChange}
					bordered/>
				<CommodityDialog ref="commodityDialog" com={this.state.com} catData={this.state.catData} callback={this.fetch}/>
			</div>
		);
	},
});

export default CommodityList;
