import React from 'react';
import {Form, Modal, message, Input} from 'antd';

const FormItem = Form.Item;

import Ajax from '../../util/Ajax';
import CommonUtil from '../../util/CommonUtil';

const CatDialog = React.createClass({
	getInitialState() {
		return {
			visible: false,
			id: 0,
			name: '',
			orderr: ''
		};
	},
	componentWillMount() {
	},

	componentWillReceiveProps(nextProps) {
		if (nextProps.isEdit) {
			this.setState({
				id: nextProps.obj.id,
				name: nextProps.obj.name,
				orderr: nextProps.obj.orderr
			});
		}
	},

	showModal(isAdd) {
		if (!isAdd) {
			this.setState({
				visible: true
			});
		} else {
			this.setState({
				id: 0,
				name: '',
				orderr: '',
				visible: true
			});
		}
	},

	handleOk() {
		if (!this.state.name) {
			message.error("名称不能为空");
			return;
		}

		if (!this.state.orderr) {
			message.error("顺序不能为空");
			return;
		}

		const params = {};
		params.id = this.state.id;
		params.name = this.state.name;
		params.orderr = this.state.orderr;

		if (!this.props.isEdit) {
			Ajax({
				url: '/ice/pc/cat/create.json',
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
				url: '/ice/pc/cat/update.json',
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
	},

	handleCancel() {
		this.setState({
			visible: false
		});
	},

	onInputChange(key, e) {
		this.state[key] = e.target.value;
		this.setState({});
	},

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
				<Modal title="新增" visible={this.state.visible} width="700px"
							 maskClosable={false}
							 onOk={this.handleOk} onCancel={this.handleCancel}
				>
					<Form>
						<FormItem
							{...formItemLayout}
							label="名称"
							required
						>
							<Input placeholder="输入" size="default" value={this.state.name}
										 onChange={this.onInputChange.bind(this, 'name')}/>
						</FormItem>
					</Form>
					<Form>
						<FormItem
							{...formItemLayout}
							label="顺序"
							required
						>
							<Input placeholder="输入序号" size="default" value={this.state.orderr}
										 onChange={this.onInputChange.bind(this, 'orderr')}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	},
});

export default CatDialog;
