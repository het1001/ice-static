import React from 'react';
import {Table, Divider, Button} from 'antd';
import Ajax from '../../util/Ajax';
import CommonUtil from '../../util/CommonUtil';
import SearchBar from './SearchBar';
import ComInDialogView from './ComInDialogView';

class ComInList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			pagination: {
				current: 1,
				total: 0,
			},
			fromTime: '',
			endTime: '',
			loading: true,
			inId: 0,
		};

		this.fetch = this.fetch.bind(this);
		this.handleTableChange = this.handleTableChange.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.view = this.view.bind(this);
	}

	componentWillMount() {
		this.fetch();
	}

	fetch() {
		this.setState({
			loading: true
		});

		Ajax({
			url: '/ice/pc/commodityIn/queryList.json',
			param: {
				fromTime: this.state.fromTime,
				endTime: this.state.endTime,
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
				fromTime: search.fromTime,
				endTime: search.endTime,
				pagination: page,
			}, this.fetch);
		} else {
			this.fetch();
		}
	}

	view(record) {
		this.setState({
			inId: record.id
		}, () => {
			this.refs.comInView.showModal();
		});
	}

	render() {
		const columns = [
			{
				title: '序号',
				width: '5%',
				dataIndex: 'id',
			}, {
				title: '单号',
				width: '50%',
				dataIndex: 'inNum',
			}, {
				title: '入库时间',
				width: '30%',
				dataIndex: 'createTime',
				render: (text, record) => (
					<span>
            {CommonUtil.pareDate(text)}
          </span>
				),
			}, {
				title: '操作',
				width: '15%',
				render: (text, record) => (
					<span>
            <a href="#commodityIn_list" onClick={this.view.bind(this, record)}>查看</a>
            <Divider type="vertical" />
            <a href="#commodityIn_list">其他</a>
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
				<ComInDialogView ref="comInView" inId={this.state.inId}/>
			</div>
		);
	}
};

export default ComInList;
