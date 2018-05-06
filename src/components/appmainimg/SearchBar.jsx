import React from 'react';
import {Form, Input, Row, Col, Icon, Button, DatePicker, Checkbox} from 'antd';

const FormItem = Form.Item;

import AppMainImgAddDialog from './AppMainImgAddDialog';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
		};

		this.handleReset = this.handleReset.bind(this);
		this.onActiveChange = this.onActiveChange.bind(this);
		this.newMainImg = this.newMainImg.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleReset(e) {
		e.preventDefault();
		this.props.form.resetFields();
		this.setState({
			active: false,
		});
	}

	onActiveChange(e) {
		this.setState({
			active: e.target.checked
		});
	}

	newMainImg() {
		this.refs.appMainImgAddDialog.showModal();
	}

	handleSubmit(e) {
		e && e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				console.log('Errors in form!!!');
				return;
			}

			values.active = this.state.active ? 1 : '',

				this.props.callback(values);
		});
	}

	render() {
		const {getFieldDecorator} = this.props.form;

		return (
			<span>
        <Form className="ant-advanced-search-form">
          <Row gutter={16}>
            <Col sm={10}>
              <FormItem
								label="广告名称"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('name')(
									<Input placeholder="输入广告名称" size="default"/>
								)}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem
								label="是否激活"
								labelCol={{span: 18}}
								wrapperCol={{span: 6}}
							>
                <Checkbox onChange={this.onActiveChange} checked={this.state.active}></Checkbox>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={2} offset={1} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} onClick={this.newMainImg}>新增广告图</Button>
            </Col>
            <Col span={10} offset={3} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} htmlType="submit"
											onClick={this.handleSubmit}>搜索</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        <AppMainImgAddDialog ref="appMainImgAddDialog" callback={this.props.callback}/>
      </span>
		);
	}
};

export default Form.create()(SearchBar);
