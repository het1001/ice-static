import React from 'react';
import {Form, Checkbox, Modal, message} from 'antd';

const FormItem = Form.Item;

import Ajax from '../../util/Ajax';
import ImgNativeShow from '../ImgNativeShow';

class AppMainImgEditDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			active: ''
		};

		this.showModal = this.showModal.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.onImageClick = this.onImageClick.bind(this);
		this.onCheckboxChange = this.onCheckboxChange.bind(this);
	}

	showModal() {
		this.setState({
			active: this.props.model.active,
			visible: true
		});
	}

	handleOk() {
		Ajax({
			url: '/ice/pc/appmainimg/edit.json',
			method: 'post',
			param: {
				id: this.props.model.id,
				active: this.state.active
			},
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

	onImageClick() {
		this.refs.imgNativeShow.showModal();
	}

	onCheckboxChange(key, e) {
		this.state[key] = e.target.checked ? 1 : 0;
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
				<Modal title="编辑" visible={this.state.visible} width="700px"
							 maskClosable={false}
							 onOk={this.handleOk} onCancel={this.handleCancel}
				>
					<Form>
						<FormItem
							{...formItemLayout}
							label="图片"
						>
							<img onClick={this.onImageClick} alt="example" width="300px" height="300px"
									 src={"http://ice2016.oss-cn-hangzhou.aliyuncs.com/" + this.props.model.imageKey}/>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="是否激活"
						>
							<Checkbox checked={this.state.active === 1} onChange={this.onCheckboxChange.bind(null, 'active')}/>
						</FormItem>
					</Form>
				</Modal>
				<ImgNativeShow ref="imgNativeShow" title="图片" imgKey={this.props.model.imageKey}/>
			</div>
		);
	}
};

export default AppMainImgEditDialog;
