import React from 'react';
import {Form, Input, Row, Col, Select, Button, DatePicker, Checkbox} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			status: false,
		};

		this.handleReset = this.handleReset.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleReset(e) {
		e.preventDefault();
		this.props.form.resetFields();
	}

	handleSubmit(e) {
		e && e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				console.log('Errors in form!!!');
				return;
			}

			this.props.callback(values);
		});
	}

	render() {
		const {getFieldDecorator} = this.props.form;

		return (
			<span>
        <Form className="ant-advanced-search-form">
          <Row gutter={16}>
            <Col sm={8}>
              <FormItem
								label="手机号"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('phone')(
									<Input size="default"/>
								)}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem
								label="状态"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('state')(
									<Select allowClear>
										<Option value="CREATE">注册</Option>
										<Option value="AUTHED">短信验证通过</Option>
										<Option value="PASSED">设置好了密码</Option>
										<Option value="AUDITING">提交了店铺信息，待审核</Option>
										<Option value="AUDIT_NO">审核不通过</Option>
										<Option value="NORMAL">正常</Option>
										<Option value="FREEAE">冻结</Option>
									</Select>
								)}
              </FormItem>
            </Col>
            <Col sm={8}>
              <Button type="primary" style={{marginLeft: '50px', marginRight: '20px'}} htmlType="submit"
											onClick={this.handleSubmit}>搜索</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
      </span>
		);
	}
};

export default Form.create()(SearchBar);
