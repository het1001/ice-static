import React from 'react';
import {Form, Button, Modal, Popover, message, Input} from 'antd';

const FormItem = Form.Item;

import Ajax from '../../util/Ajax';
import CommonUtil from '../../util/CommonUtil';

import ImgNativeShow from '../ImgNativeShow';
import NoAccessModel from './NoAccessModel';

class UserAuditDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			popoverVisible: false,
			phone: '',
			userName: '',
			shopName: '',
			shopAddress: '',
			shopImgKey: '',
			freezerType: '',
			freezerModel: '',
			arkTime: '',
			standbyPhone: '',
			memo: '',
		};

		this.showModal = this.showModal.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.handleAccess = this.handleAccess.bind(this);
		this.handleNoAccess = this.handleNoAccess.bind(this);
		this.handlefreeae = this.handlefreeae.bind(this);
		this.handleVisibleChange = this.handleVisibleChange.bind(this);
		this.showNativeImg = this.showNativeImg.bind(this);
	}

	showModal() {
		Ajax({
			url: '/ice/pc/user/getLastShopInfo.json',
			param: {
				phone: this.props.user.phone
			},
			callback: (result) => {
				if (result.success && result.data) {
					this.setState({
						userName: result.data.userName,
						shopName: result.data.shopName,
						shopAddress: result.data.shopAddress,
						shopImgKey: result.data.shopImgKey,
						freezerType: result.data.freezerType,
						freezerModel: result.data.freezerModel,
						arkTime: result.data.arkTime,
						standbyPhone: result.data.standbyPhone
					});
				} else {
				}
			},
		});

		this.setState({
			visible: true
		});
	}

	handleCancel() {
		this.setState({
			visible: false
		});
	}

	handleAccess() {
		Ajax({
			url: '/ice/pc/user/auditShopInfo.json',
			method: 'post',
			param: {
				id: this.props.user.id,
				action: 'agree',
			},
			callback: (result) => {
				if (result.success) {
					message.success('操作成功');
					this.handleCancel();
					this.props.callback();
				} else {
					message.error(result.message);
				}
			},
		});
	}

	handleNoAccess() {
		if (!this.state.memo) {
			message.error("请填写审核意见");
			return;
		}

		Ajax({
			url: '/ice/pc/user/auditShopInfo.json',
			method: 'post',
			param: {
				id: this.props.user.id,
				action: 'reject',
				memo: this.state.memo,
			},
			callback: (result) => {
				if (result.success) {
					message.success('操作成功');
					this.setState({
						popoverVisible: false
					}, this.handleCancel);
					this.props.callback();
				} else {
					message.error(result.message);
				}
			},
		});
	}

	handlefreeae() {
		Ajax({
			url: '/ice/pc/user/freeae.json',
			method: 'post',
			param: {
				id: this.props.user.id
			},
			callback: (result) => {
				if (result.success) {
					message.success('冻结成功');
					this.handleCancel();
					this.props.callback();
				} else {

				}
			},
		});
	}

	handleVisibleChange(popoverVisible) {
		this.setState({popoverVisible});
	}

	showNativeImg() {
		this.refs.imgNativeShow.showModal();
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
				<Modal title="用户店铺信息审核" visible={this.state.visible} width="700px"
							 maskClosable={false}
							 onCancel={this.handleCancel}
							 footer={[
								 <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>,
								 <Button key="audit_access" type="primary" size="large" onClick={this.handleAccess}>通过</Button>,
								 <Popover
									 content={<span>
                                   意见<Input.TextArea onChange={(e) => {
										 this.setState({
											 memo: e.target.value
										 });
									 }}/>
                                   <a onClick={this.handleNoAccess}>确认</a>
                               </span>}
									 title="审核意见"
									 trigger="click"
									 visible={this.state.popoverVisible}
									 onVisibleChange={this.handleVisibleChange}
								 >
									 <Button key="audit_noaccess" type="dashed" size="large">不通过</Button>
								 </Popover>,
								 <Button key="freese" type="danger" size="large" onClick={this.handlefreeae}>竞争对手..冻结</Button>
							 ]}
				>
					<Form>
						<FormItem
							{...formItemLayout}
							label="手机号"
						>
							{this.props.user.phone}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="姓名"
						>
							{this.state.userName}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="店铺名称"
						>
							{this.state.shopName}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="店铺地址"
						>
							{this.state.shopAddress}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="店铺图片"
						>
							{this.state.shopImgKey ? <img onClick={this.showNativeImg}
																						src={"http://ice2016.oss-cn-hangzhou.aliyuncs.com/" + this.state.shopImgKey + "?x-oss-process=image/resize,m_fixed,h_300,w_300"}/> : ''}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="冰柜种类"
						>
							{this.state.freezerType}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="冰柜型号"
						>
							{this.state.freezerModel}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="投柜时间"
						>
							{CommonUtil.pareDate(this.state.arkTime, 'yyyy-MM-dd')}
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="备用手机号"
						>
							{this.state.standbyPhone}
						</FormItem>
					</Form>
				</Modal>
				<ImgNativeShow ref="imgNativeShow" title="原始图片" imgKey={this.state.shopImgKey}/>
				<NoAccessModel phone={this.state.phone}/>
			</div>
		);
	}
};

export default UserAuditDialog;
