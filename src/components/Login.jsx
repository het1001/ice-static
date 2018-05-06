import React from 'react';
import {Alert, Button, Form, Input, message, Icon} from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;

import Ajax from '../util/Ajax';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			nameError: '',
			pwdError: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				console.log('Errors in form!!!');
				return;
			}

			if (!values.userName) {
				this.setState({
					nameError: '用户名不能为空'
				});
				return;
			} else {
				this.setState({
					nameError: ''
				});
			}

			if (!values.passWord) {
				this.setState({
					pwdError: '密码不能为空'
				});
				return;
			} else {
				this.setState({
					pwdError: ''
				});
			}

			Ajax({
				url: '/ice/pc/user/login.json',
				method: 'post',
				param: {
					type: 'BIZ',
					userName: values.userName,
					passWord: values.passWord
				},
				callback: (result) => {
					if (result.success) {
						window.location.href = '/ice/pc/index.htm' + (param.hash ? ('#' + param.hash) : '');
					} else {
						this.setState({
							nameError: result.errorMsg
						});
					}
				},
			});
		});
	}

	noop() {
		return false;
	}

	render() {
		const {getFieldDecorator, getFieldError, isFieldValidating} = this.props.form;
		const formItemLayout = {
			labelCol: {span: 18},
			wrapperCol: {span: 6},
		};

		return (
			<div style={{width: '80%', paddingLeft: '30px', float: 'left'}}>
				<Form>
					<FormItem
						wrapperCol={{span: 14, offset: 18}}
					>
						<span style={{fontSize: 20}}>白云冷饮后台管理</span>
					</FormItem>

					<FormItem
						{...formItemLayout}
						label="账号"
						help={this.state.nameError ? <span style={{color: 'red'}}>{this.state.nameError}</span> : ''}
					>
						{getFieldDecorator('userName')(
							<Input addonBefore={<Icon type="user"/>} placeholder="请输入账号"/>
						)}
					</FormItem>

					<FormItem
						{...formItemLayout}
						label="密码"
						help={this.state.pwdError ? <span style={{color: 'red'}}>{this.state.pwdError}</span> : ''}
					>
						{getFieldDecorator('passWord')(
							<Input addonBefore={<Icon type="lock"/>} type="password" autoComplete="off" placeholder="请输入密码"
										 onContextMenu={this.noop} onPaste={this.noop} onCopy={this.noop} onCut={this.noop}
							/>
						)}
					</FormItem>

					<FormItem wrapperCol={{span: 14, offset: 18}}>
						<Button type="primary" onClick={this.handleSubmit}>登录</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
};

export default createForm()(Login);
