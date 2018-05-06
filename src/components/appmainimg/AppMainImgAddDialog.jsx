import React from 'react';
import {Form, Modal, message, Input} from 'antd';

const FormItem = Form.Item;

import Ajax from '../../util/Ajax';
import FileUpload from '../FileUpload';

class AppMainImgAddDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			confirmLoading: false,
			name: '',
			imageKey: ''
		};

		this.showModal = this.showModal.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.fileUploadBefore = this.fileUploadBefore.bind(this);
		this.handleFileUpload = this.handleFileUpload.bind(this);
		this.onNameChange = this.onNameChange.bind(this);
	}

	showModal() {
		this.setState({
			name: '',
			imageKey: '',
			visible: true
		});
	}

	handleOk() {
		if (!this.state.name) {
			message.error('名称不能为空');
			return;
		}

		if (!this.state.imageKey) {
			message.error('图片不能为空');
			return;
		}

		Ajax({
			url: '/ice/pc/appmainimg/create.json',
			method: 'post',
			param: this.state,
			callback: (result) => {
				if (result.success) {
					this.handleCancel();
					message.success('保存成功');
					this.props.callback();
				} else {
					message.error('保存失败：' + result.errorMsg);
				}
			},
		});
	}

	handleCancel() {
		this.setState({
			visible: false
		});
	}

	fileUploadBefore() {
		this.setState({
			confirmLoading: true
		});
	}

	handleFileUpload(key, imageKey) {
		this.setState({
			imageKey,
			confirmLoading: false
		});
	}

	onNameChange(e) {
		this.setState({
			name: e.target.value
		});
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
				<Modal title="添加图片" visible={this.state.visible} width="700px"
							 maskClosable={false}
							 confirmLoading={this.state.confirmLoading}
							 onOk={this.handleOk} onCancel={this.handleCancel}
				>
					<Form>
						<FormItem
							{...formItemLayout}
							label="名称"
						>
							<Input placeholder="输入名称" size="default" onChange={this.onNameChange}/>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="图片"
						>
							<FileUpload before={this.fileUploadBefore} callback={this.handleFileUpload} value={this.state.imageKey} commodity={{}}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
};

export default AppMainImgAddDialog;
