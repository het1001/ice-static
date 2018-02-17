import React from 'react';
import {Table, Icon, Popconfirm, message, Divider} from 'antd';
import Ajax from '../../util/Ajax';

import SearchBar from './SearchBar';
import ImgNativeShow from '../ImgNativeShow';

import AppMainImgEditDialog from './AppMainImgEditDialog';

class AppMainImgList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			pagination: {
				current: 1,
				total: 0,
			},
			loading: true,
			model: {},
			name: '',
			active: '',
			main: '',
		};

		this.fetch = this.fetch.bind(this);
		this.handleTableChange = this.handleTableChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.viewImg = this.viewImg.bind(this);
		this.edit = this.edit.bind(this);
		this.delete = this.delete.bind(this);
	}

	componentWillMount() {
		this.fetch();
	}

	fetch() {
		this.setState({
			loading: true
		});

		Ajax({
			url: '/ice/pc/appmainimg/queryList.json',
			param: {
				name: this.state.name,
				active: this.state.active,
				isMain: this.state.main,
				pageNum: this.state.pagination.pageNum,
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
				active: search.active,
				main: search.main,
				pagination: page,
			}, this.fetch);
		} else {
			this.fetch();
		}
	}

	viewImg(record) {
		this.setState({
			model: record
		}, () => {
			this.refs.imgNativeShow.showModal();
		});
	}

	edit(record) {
		this.setState({
			model: record
		}, () => {
			this.refs.appMainImgEditDialog.showModal();
		});
	}

	delete(record) {
		Ajax({
			url: '/ice/pc/appmainimg/delete.json',
			method: 'post',
			param: {
				id: record.id
			},
			callback: (result) => {
				if (result.success) {
					message.success('删除成功');
					this.fetch();
				} else {
					message.error('保存失败：' + result.errorMsg);
				}
			},
		});
	}

	render() {
		const columns = [
			{
				title: '序号',
				width: '3%',
				dataIndex: 'id',
			}, {
				title: '名称',
				width: '12%',
				dataIndex: 'name'
			}, {
				title: '是否激活',
				width: '5%',
				dataIndex: 'active',
				render: (text, record) => {
					if (text && text === 1) {
						return <Icon type="check" style={{color: 'green'}}/>;
					} else {
						return <Icon type="close" style={{color: 'red'}}/>;
					}
				},
			}, {
				title: '操作',
				width: '7%',
				render: (text, record) => (
					<span>
                        <a onClick={this.viewImg.bind(this, record)}>查看</a>
                        <Divider type="vertical" />
                        <a onClick={this.edit.bind(this, record)}>编辑</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确定要删除该图片吗?" onConfirm={this.delete.bind(this, record)}
																		okText="是" cancelText="否">
                            <a>删除</a>
                        </Popconfirm>
                    </span>
				),
			}];

		return (
			<div>
				<Table
					title={() => <SearchBar callback={this.handleSearch}/>}
					columns={columns}
					dataSource={this.state.data}
					pagination={this.state.pagination}
					loading={this.state.loading}
					onChange={this.handleTableChange}
					bordered/>
				<ImgNativeShow ref="imgNativeShow" title="图片" imgKey={this.state.model.imageKey}/>
				<AppMainImgEditDialog ref="appMainImgEditDialog" callback={this.fetch} model={this.state.model}/>
			</div>
		);
	}
};

export default AppMainImgList;
