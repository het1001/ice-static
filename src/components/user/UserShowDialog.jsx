import React from 'react';
import {Form, Button, Modal} from 'antd';

const FormItem = Form.Item;

import Ajax from '../../util/Ajax';

import ImgNativeShow from '../ImgNativeShow';

const UserShowDialog = React.createClass({
	getInitialState() {
		return {
			visible: false,
			shopName: '',
			shopAddress: '',
			shopImgKey: '',
			isAccess: 1,
			auditMemo: ''
		};
	},
	componentWillMount() {
	},

	componentWillReceiveProps(nextProps) {
	},

	showModal() {
		Ajax({
			url: '/ice/pc/user/getLastShopInfo.json',
			param: {
				phone: this.props.user.phone
			},
			callback: (result) => {
				if (result.success && result.data) {
					this.setState({
						shopName: result.data.shopName,
						shopAddress: result.data.shopAddress,
						shopImgKey: result.data.shopImgKey,
						isAccess: result.data.isAccess,
						auditMemo: result.data.auditMemo,
					});
				} else {
				}
			}
		});

		this.setState({
			visible: true
		});
	},

	handleCancel() {
		this.setState({
			visible: false
		});
	},

	render() {
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 6}
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 14}
			}
		};

		return (
			<div>
				<Modal title="查看用户信息" visible={this.state.visible} width="700px"
							 onCancel={this.handleCancel}
							 maskClosable={false}
							 footer={[
								 <Button key="back" size="large" onClick={this.handleCancel}>关闭</Button>
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
							{this.state.shopImgKey ? <img alt="example" width="200px" height="200px"
																						src={"http://ice2016.oss-cn-hangzhou.aliyuncs.com/" + this.state.shopImgKey}/> : ''}
						</FormItem>
						{
							this.state.isAccess === -1 ?
								<FormItem
									{...formItemLayout}
									label="不通过原因"
								>
									<p style={{color: 'red'}}>{this.state.auditMemo}</p>
								</FormItem>
								:
								''
						}
					</Form>
				</Modal>
				<ImgNativeShow title="原始图片" imgKey={this.state.shopImgKey}/>
			</div>
		);
	}
});

export default UserShowDialog;
