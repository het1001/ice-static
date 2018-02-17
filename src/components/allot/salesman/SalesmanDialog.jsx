import React from 'react';
import {Form, Select, Modal, Popover, message, Input} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

import Ajax from '../../../util/Ajax';

class SalesmanDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			id: 0,
			name: '',
			uniqueKey: '',
			phone: '',
			type: 'DELIVERYMEN'
		};

		this.showModal = this.showModal.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isEdit) {
			this.setState({
				id: nextProps.obj.id,
				name: nextProps.obj.name,
				uniqueKey: nextProps.obj.uniqueKey,
				phone: nextProps.obj.phone,
				type: nextProps.obj.salesmanTypeEnum
			});
		}
	}

	showModal(isAdd) {
		if (isAdd) {
			this.setState({
				id: 0,
				name: '',
				uniqueKey: '',
				phone: '',
				type: 'DELIVERYMEN'
			});
		}

		this.setState({
			visible: true
		});
	}

	handleOk() {
		if (!this.state.name) {
			message.error("姓名不能为空");
			return;
		}

		if (!this.state.phone) {
			message.error("手机不能为空");
			return;
		}

		Ajax({
			url: '/ice/pc/salesman/check.json',
			param: {
				id: this.state.id,
				uniqueKey: this.state.uniqueKey
			},
			callback: (result) => {
				if (result.success && result.data) {
					if (!this.props.isEdit) {
						Ajax({
							url: '/ice/pc/salesman/create.json',
							method: 'post',
							param: JSON.stringify(this.state),
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
							url: '/ice/pc/salesman/update.json',
							method: 'post',
							param: JSON.stringify(this.state),
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
					message.error("唯一标识重复了");
				}
			},
		});
	}

	handleCancel() {
		this.setState({
			visible: false
		});
	}

	onInputChange(key, e) {
		this.state[key] = e.target.value;
		this.setState({});
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
				<Modal title="新增内部成员" visible={this.state.visible} width="700px"
							 maskClosable={false}
							 onOk={this.handleOk} onCancel={this.handleCancel}
				>
					<Form>
						<FormItem
							{...formItemLayout}
							label="姓名"
							required
						>
							<Input placeholder="输入名称" size="default" value={this.state.name}
										 onChange={this.onInputChange.bind(this, 'name')}/>
						</FormItem>
					</Form>
					<Form>
						<FormItem
							{...formItemLayout}
							label="唯一标识"
						>
							<Input placeholder="输入唯一标识" size="default" value={this.state.uniqueKey}
										 onChange={this.onInputChange.bind(this, 'uniqueKey')}/>
						</FormItem>
					</Form>
					<Form>
						<FormItem
							{...formItemLayout}
							label="手机"
							required
						>
							<Input placeholder="输入手机号" size="default" value={this.state.phone}
										 onChange={this.onInputChange.bind(this, 'phone')}/>
						</FormItem>
					</Form>
					<Form>
						<FormItem
							{...formItemLayout}
							label="类型"
						>
							<Select
								style={{width: '100%'}}
								optionFilterProp="children"
								value={this.state.type}
								onChange={this.handleSelectChange.bind(this, 'type')}
							>
								<Option key="DELIVERYMEN" value="DELIVERYMEN">配送员</Option>
								<Option key="SALESMAN" value="SALESMAN">业务员</Option>
							</Select>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
};

export default SalesmanDialog;
