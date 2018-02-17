import React from 'react';
import {Table, message, Popconfirm, Divider} from 'antd';
import Ajax from '../../../util/Ajax';
import SearchBar from './SearchBar';

import DistrictDialog from './DistrictDialog';

class DistrictList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			pagination: {
				current: 1,
				total: 0,
			},
			name: '',
			isEdit: false,
			loading: true,
			obj: {},
			deliveryMens: [],
			salesmans: [],
		};

		this.fetch = this.fetch.bind(this);
		this.handleTableChange = this.handleTableChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.edit = this.edit.bind(this);
		this.delete = this.delete.bind(this);
	}

	componentWillMount() {
		this.fetch();
		Ajax({
			url: '/ice/pc/salesman/queryByType.json',
			param: {},
			callback: (result) => {
				if (result.success) {
					this.setState({
						deliveryMens: result.deliveryMen,
						salesmans: result.salesman
					});
				} else {
					message.error(result.errorMsg);
				}
			},
		});
	}

	fetch() {
		this.setState({
			loading: true
		});

		Ajax({
			url: '/ice/pc/district/queryList.json',
			param: {
				name: this.state.name,
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
				name: search.name,
				pagination: page,
			}, this.fetch);
		} else {
			this.fetch();
		}
	}

	edit(record) {
		this.setState({
			obj: record,
			isEdit: true,
		}, () => {
			this.refs.districtDialog.showModal(false);
		});
	}

	delete(record) {
		Ajax({
			url: '/ice/pc/district/delete.json',
			method: 'post',
			param: JSON.stringify(record),
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
				title: '名称',
				dataIndex: 'name',
			}, {
				title: '操作',
				width: '10%',
				render: (text, record) => (
					<span>
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
						deliveryMens={this.state.deliveryMens}
						salesmans={this.state.salesmans}
						callback={this.handleSearch}
					/>}
					columns={columns}
					dataSource={this.state.data}
					pagination={this.state.pagination}
					loading={this.state.loading}
					onChange={this.handleTableChange}
					bordered/>
				<DistrictDialog
					ref="districtDialog"
					obj={this.state.obj}
					isEdit={this.state.isEdit}
					deliveryMens={this.state.deliveryMens}
					salesmans={this.state.salesmans}
					callback={this.fetch}/>
			</div>
		);
	}
};

export default DistrictList;
