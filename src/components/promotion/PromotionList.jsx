import React from 'react';
import {Table, message, Popconfirm, Icon, Divider} from 'antd';
import Ajax from '../../util/Ajax';
import SearchBar from './SearchBar';
import CommonUtil from '../../util/CommonUtil';
import PromotionDialog from './PromotionDialog';

class PromotionList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			pagination: {
				current: 1,
				total: 0,
			},
			comId: 0,
			state: '',
			isCurrent: false,
			isEdit: false,
			loading: true,
			obj: {},
			arithmetic: [],
			arithmeticMap: {},
			comData: [],
		};

		this.fetch = this.fetch.bind(this);
		this.handleTableChange = this.handleTableChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.online = this.online.bind(this);
		this.offline = this.offline.bind(this);
		this.edit = this.edit.bind(this);
		this.delete = this.delete.bind(this);
	}

	componentWillMount() {
		this.fetch();
		Ajax({
			url: '/ice/pc/commodity/queryAll.json',
			param: {},
			callback: (result) => {
				if (result.success) {
					if (result.data && result.data.length > 0) {
						this.setState({
							comData: result.data
						});
					}
				} else {
					this.setState({
						comData: []
					});
				}
			},
		});

		Ajax({
			url: '/ice/pc/arithmetic/queryAll.json',
			param: {},
			callback: (result) => {
				if (result.success) {
					if (result.data && result.data.length > 0) {
						const arithmeticMap = {};
						for (let i in result.data) {
							arithmeticMap[result.data[i].id] = result.data[i];
						}

						this.setState({
							arithmetic: result.data,
							arithmeticMap
						});
					}
				} else {
					this.setState({
						arithmetic: [],
						arithmeticMap: {},
					});
				}
			},
		});
	}

	fetch() {
		this.setState({
			loading: true
		});

		Ajax({
			url: '/ice/pc/promotion/queryList.json',
			param: {
				comId: this.state.comId,
				state: this.state.state,
				isCurrent: this.state.isCurrent,
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

	handleSearch(search) {
		if (search) {
			const page = this.state.pagination;
			page.current = 1;

			this.setState({
				comId: search.comId,
				state: search.state,
				isCurrent: search.isCurrent,
				pagination: page,
			}, this.fetch);
		} else {
			this.fetch();
		}
	}

	online(record) {
		const param = {};
		param.id = record.id;
		Ajax({
			url: '/ice/pc/promotion/online.json',
			method: 'post',
			param: JSON.stringify(param),
			callback: (result) => {
				if (result.success) {
					message.success('启用成功');
					this.fetch();
				} else {
					message.error('启用失败：' + result.errorMsg);
				}
			},
		});
	}

	offline(record) {
		const param = {};
		param.id = record.id;
		Ajax({
			url: '/ice/pc/promotion/offline.json',
			method: 'post',
			param: JSON.stringify(param),
			callback: (result) => {
				if (result.success) {
					message.success('禁用成功');
					this.fetch();
				} else {
					message.error('禁用失败：' + result.errorMsg);
				}
			},
		});
	}

	edit(record) {
		this.setState({
			obj: record,
			isEdit: true,
		}, () => {
			this.refs.promotionDialog.showModal(false);
		});
	}

	delete(record) {
		const param = {};
		param.id = record.id;
		Ajax({
			url: '/ice/pc/promotion/delete.json',
			method: 'post',
			param: JSON.stringify(param),
			callback: (result) => {
				if (result.success) {
					message.success('删除成功');
					this.fetch();
				} else {
					message.error('删除失败：' + result.errorMsg);
				}
			},
		});
	}

	render() {
		const columns = [
			{
				title: '序号',
				width: '5%',
				dataIndex: 'id',
			}, {
				title: '商品',
				dataIndex: 'comName',
			}, {
				title: '促销描述',
				dataIndex: 'desc',
			}, {
				title: '是否启用',
				dataIndex: 'state',
				width: '8%',
				render: (text, record) => (
					(text === 'ON_LINE') ? <span style={{color: 'green'}}><Icon type="check-circle"/>启用</span>
						:
						<span style={{color: 'red'}}><Icon type="close-circle"/>禁用</span>
				),
			}, {
				title: '生效日期',
				dataIndex: 'effectiveDate',
				width: '13%',
				render: (text, record) => (
					<span>
								{CommonUtil.pareDate(text)}
							</span>
				),
			}, {
				title: '截止日期',
				dataIndex: 'deadline',
				width: '13%',
				render: (text, record) => (
					<span>
									{CommonUtil.pareDate(text)}
								</span>
				),
			}, {
				title: '操作',
				width: '12%',
				render: (text, record) => (
					<span>
								{
									record.state === 'ON_LINE' ?
										<Popconfirm title="确定要禁用吗?" onConfirm={this.offline.bind(this, record)} okText="是"
																cancelText="否">
											<a href="#commodity_list">禁用</a>
										</Popconfirm>
										:
										<Popconfirm title="确定要启用吗?" onConfirm={this.online.bind(this, record)} okText="是"
																cancelText="否">
											<a href="#commodity_list">启用</a>
										</Popconfirm>
								}
								<Divider type="vertical" />
								<a onClick={this.edit.bind(this, record)}>编辑</a>
								<Divider type="vertical" />
								<Popconfirm title="确定要删除吗?" onConfirm={this.delete.bind(this, record)}
														okText="是" cancelText="否">
									<a>删除</a>
								</Popconfirm>
							</span>
				),
			}];

		return (
			<div>
				<Table
					title={() => <SearchBar
						comData={this.state.comData}
						arithmetic={this.state.arithmetic}
						arithmeticMap={this.state.arithmeticMap}
						callback={this.handleSearch}
					/>}
					columns={columns} dataSource={this.state.data} pagination={this.state.pagination}
					loading={this.state.loading} onChange={this.handleTableChange} bordered
				/>
				<PromotionDialog
					ref="promotionDialog" obj={this.state.obj} isEdit={this.state.isEdit} comData={this.state.comData}
					arithmetic={this.state.arithmetic} arithmeticMap={this.state.arithmeticMap} callback={this.fetch}
				/>
			</div>
		);
	}
};

export default PromotionList;
