import React from 'react';
import {Form, Input, InputNumber, Row, Col, Modal, Upload, message} from 'antd';

const FormItem = Form.Item;

import Ajax from '../../util/Ajax';
import CommodityForm from './CommodityForm';

class CommodityDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			fileKey: '',
			com: {}
		};

		this.showModal = this.showModal.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.isEdit = this.isEdit.bind(this);
		this.handleOk = this.handleOk.bind(this);
	}

	showModal() {
		this.setState({
			visible: true
		});
	}

	handleCancel() {
		this.setState({
			visible: false
		});
	}

	isEdit() {
		return this.props.type !== 'new';
	}

	handleOk() {
		this.refs.commodityForm.getForm().validateFields((errors, values) => {
			if (errors) {
				console.log('Errors in form!!!');
				return;
			}

			if (this.isEdit()) {
				values.id = this.props.com.id;
				Ajax({
					url: '/ice/pc/commodity/update.json',
					method: 'post',
					param: values,
					callback: (result) => {
						if (result.success) {
							this.handleCancel();
							message.success('更新成功');
							this.props.callback();
						} else {
							message.error('更新失败：' + result.errorMsg);
						}
					}
				});
			} else {
				Ajax({
					url: '/ice/pc/commodity/create.json',
					method: 'post',
					param: values,
					callback: (result) => {
						if (result.success) {
							this.handleCancel();
							message.success('保存成功');
							this.props.callback();
						} else {
							message.error('保存失败：' + result.errorMsg);
						}
					}
				});
			}
		});
	}

	render() {
		let title = this.props.type === 'new' ? '新增商品' : '修改商品信息';

		return (
			<div>
				<Modal title={title} visible={this.state.visible} width="1000px"
							 onOk={this.handleOk} onCancel={this.handleCancel}
				>
					<CommodityForm ref="commodityForm" com={this.props.com} catData={this.props.catData}/>
				</Modal>
			</div>
		);
	}
};

export default CommodityDialog;
