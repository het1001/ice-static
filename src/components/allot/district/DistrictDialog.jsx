import React from 'react';
import {Form, Select, Modal, message, Input} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

import Ajax from '../../../util/Ajax';

class DistrictDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			id: 0,
			name: '',
			districtor: [],
			salesman: []
		};

		this.showModal = this.showModal.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isEdit) {
			this.setState({
				id: nextProps.obj.id,
				name: nextProps.obj.name
			});
		}
	}

	showModal(isAdd) {
		if (!isAdd) {
			Ajax({
				url: '/ice/pc/district/querySalesmanById.json',
				param: {
					id: this.state.id
				},
				callback: (result) => {
					if (result.success) {
						this.setState({
							districtor: result.districtor,
							salesman: result.salesman
						});
					} else {
					}
				},
			});
		} else {
			this.setState({
				id: 0,
				name: '',
				districtor: [],
				salesman: []
			});
		}

		this.setState({
			visible: true
		});
	}

	handleOk() {
		if (!this.state.name) {
			message.error("名称不能为空");
			return;
		}

		Ajax({
			url: '/ice/pc/district/check.json',
			param: {
				id: this.state.id,
				name: this.state.name
			},
			callback: (result) => {
				if (result.success && result.data) {
					const params = {};
					params.id = this.state.id;
					params.name = this.state.name;
					params.salesmanIds = this.state.districtor.concat(this.state.salesman);
					if (!this.props.isEdit) {
						Ajax({
							url: '/ice/pc/district/create.json',
							method: 'post',
							param: JSON.stringify(params),
							callback: (result) => {
								if (result.success) {
									this.handleCancel();
									message.success('新增成功');
									this.props.callback();
								} else {
									message.error('新增失败：' + result.errorMsg);
								}
							},
						});
					} else {
						Ajax({
							url: '/ice/pc/district/update.json',
							method: 'post',
							param: JSON.stringify(params),
							callback: (result) => {
								if (result.success) {
									this.handleCancel();
									message.success('更新成功');
									this.props.callback();
								} else {
									message.error('更新失败：' + result.errorMsg);
								}
							},
						});
					}

				} else {
					message.error("名称重复了");
				}
			},
		});
	}

	handleCancel() {
		this.setState({
			visible: false
		});
	}

	onNameChange(e) {
		this.setState({
			name: e.target.value
		});
	}

	handleSelectChange(key, e) {
		this.state[key] = e;
		this.setState({});
	}

	render() {
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 6},
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 14},
			},
		};

		return (
			<div>
				<Modal title="新增片区" visible={this.state.visible} width="700px"
							 maskClosable={false}
							 onOk={this.handleOk} onCancel={this.handleCancel}
				>
					<Form>
						<FormItem
							{...formItemLayout}
							label="名称"
							required
						>
							<Input placeholder="输入名称" size="default" value={this.state.name} onChange={this.onNameChange}/>
						</FormItem>
					</Form>
					<Form>
						<FormItem
							{...formItemLayout}
							label="配送员"
						>
							<Select
								showSearch
								mode="multiple"
								style={{width: '100%'}}
								optionFilterProp="children"
								value={this.state.districtor}
								onChange={this.handleSelectChange.bind(this, 'districtor')}
							>
								{
									this.props.deliveryMens.map((item) => {
										return <Option key={item.id}
																	 value={String(item.id)}>{item.uniqueKey ? item.name + '（' + item.uniqueKey + '）' : item.name}</Option>;
									})
								}
							</Select>
						</FormItem>
					</Form>
					<Form>
						<FormItem
							{...formItemLayout}
							label="业务员"
						>
							<Select
								showSearch
								mode="multiple"
								style={{width: '100%'}}
								value={this.state.salesman}
								optionFilterProp="children"
								onChange={this.handleSelectChange.bind(this, 'salesman')}
							>
								{
									this.props.salesmans.map((item) => {
										return <Option key={item.id}
																	 value={String(item.id)}>{item.uniqueKey ? item.name + '（' + item.uniqueKey + '）' : item.name}</Option>;
									})
								}
							</Select>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
};

export default DistrictDialog;
