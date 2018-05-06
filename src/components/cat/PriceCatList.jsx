import React from 'react';
import {Table, message, Popconfirm, Button, Divider} from 'antd';
import Ajax from '../../util/Ajax';
import CommonUtil from '../../util/CommonUtil';
import CatDialog from './CatDialog';

class PriceCatList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			pagination: {
				current: 1,
				total: 0,
			},
			isEdit: false,
			loading: true,
			obj: {},
		};

	}

	componentWillMount() {
		this.fetch();
	}

	fetch = () => {
		this.setState({
			loading: true
		});

		Ajax({
			url: '/ice/pc/cat/queryPriceList.json',
			param: {},
			callback: (result) => {
				if (result.success) {
					this.setState({
						data: result.data.map((item) => {
							item.key = item.id;
							return item;
						}),
						loading: false
					});
				} else {
					message.error(result.errorMsg);
				}
			},
		});
	}

	newCat = () => {
		this.setState({
			isEdit: false,
		}, () => {
			this.refs.catDialog.showModal(true);
		});
	}

	edit = (record) => {
		this.setState({
			obj: record,
			isEdit: true,
		}, () => {
			this.refs.catDialog.showModal(false);
		});
	}

	delete = (record) => {
		Ajax({
			url: '/ice/pc/cat/delete.json',
			method: 'post',
			param: {
				id: record.id
			},
			callback: (result) => {
				if (result.success) {
					message.success('删除成功');
					this.fetch();
				} else {
					message.error('删除失败：' + result.errorMsg);
				}
			}
		});
	}

	render() {
		const columns = [
			{
				title: '序号',
				width: '5%',
				dataIndex: 'id',
			}, {
				title: '类型名称',
				dataIndex: 'name',
			}, {
				title: '顺序',
				dataIndex: 'orderr',
			}, {
				title: '操作',
				width: '12%',
				render: (text, record) => (
					<span>
						<a onClick={this.edit.bind(this, record)}>编辑</a>
						<Divider type="vertical" />
						<Popconfirm title="确定要删除吗? " onConfirm={this.delete.bind(this, record)}
												okText="是" cancelText="否">
							<a>删除</a>
						</Popconfirm>
					</span>
				),
			}];

		return (
			<div>
				<Button type="primary" style={{margin: '20px 0px 20px 80px'}} onClick={this.newCat}>新增</Button>

				<Table
					columns={columns}
					dataSource={this.state.data}
					pagination={false}
					loading={this.state.loading}
					bordered
				/>
				<CatDialog
					ref="catDialog" type="PRICE" obj={this.state.obj} isEdit={this.state.isEdit} callback={this.fetch}
				/>
			</div>
		);
	}
};

export default PriceCatList;
