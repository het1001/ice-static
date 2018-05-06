import React from 'react';
import {Form, Input, Row, Col, Button, Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

import DistrictDialog from './SalesmanDialog';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.handleReset = this.handleReset.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.newDistrict = this.newDistrict.bind(this);
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

	newDistrict() {
		this.refs.districtDialog.showModal(true);
	}

	render() {
		const {getFieldDecorator} = this.props.form;

		return (
			<span>
        <Form className="ant-advanced-search-form">
          <Row gutter={16}>
            <Col sm={8}>
              <FormItem
								label="姓名"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('name')(
									<Input size="default"/>
								)}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem
								label="类型"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('type')(
									<Select allowClear>
										<Option value="DELIVERYMEN">配送员</Option>
										<Option value="SALESMAN">业务员</Option>
									</Select>
								)}
              </FormItem>
            </Col>
            <Col sm={8}>

            </Col>
          </Row>
          <Row>
            <Col span={2} offset={1} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} onClick={this.newDistrict}>新增</Button>
            </Col>
            <Col span={10} offset={3} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} htmlType="submit"
											onClick={this.handleSubmit}>搜索</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        <DistrictDialog deliveryMens={this.props.deliveryMens}
												salesmans={this.props.salesmans}
												ref="districtDialog" callback={this.props.callback}/>
      </span>
		);
	}
};

export default Form.create()(SearchBar);
