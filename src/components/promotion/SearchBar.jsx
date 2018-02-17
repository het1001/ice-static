import React from 'react';
import {Form, Select, Checkbox, Row, Col, Button} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

import PromotionDialog from './PromotionDialog';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isCurrent: false,
		};

		this.handleReset = this.handleReset.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.onStatusChange = this.onStatusChange.bind(this);
		this.add = this.add.bind(this);
	}

	handleReset(e) {
		e.preventDefault();
		this.setState({
			isCurrent: false,
		});
		this.props.form.resetFields();
	}

	handleSubmit(e) {
		e && e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				console.log('Errors in form!!!');
				return;
			}

			values.isCurrent = this.state.isCurrent;
			this.props.callback(values);
		});
	}

	onStatusChange(e) {
		this.setState({
			isCurrent: e.target.checked
		}, () => {
			this.handleSubmit();
		});
	}

	add() {
		this.refs.promotionDialog.showModal(true);
	}

	render() {
		const {getFieldDecorator} = this.props.form;

		return (
			<span>
        <Form className="ant-advanced-search-form">
          <Row gutter={16}>
            <Col sm={8}>
              <FormItem
								label="商品"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('comId')(
									<Select
										size="small"
										showSearch
										allowClear
										style={{width: '100%'}}
										optionFilterProp="children"
									>
										{
											this.props.comData.map((item) => {
												return <Option key={item.id} value={String(item.id)}>{item.name}</Option>;
											})
										}
									</Select>
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
									<Select
										size="small"
										showSearch
										allowClear
										style={{width: '100%'}}
										optionFilterProp="children"
									>
										<Option key="ON_LINE" value="ON_LINE">已启用</Option>
										<Option key="OFF_LINE" value="OFF_LINE">禁用</Option>
									</Select>
								)}
              </FormItem>
            </Col>
            <Col sm={8}>
              <FormItem
								label="是否当前生效的"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                <Checkbox onChange={this.onStatusChange} checked={this.state.isCurrent}></Checkbox>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={2} offset={1} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} onClick={this.add}>新增</Button>
            </Col>
            <Col span={10} offset={3} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} htmlType="submit"
											onClick={this.handleSubmit}>搜索</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        <PromotionDialog comData={this.props.comData} arithmetic={this.props.arithmetic}
												 arithmeticMap={this.props.arithmeticMap}
												 ref="promotionDialog" callback={this.props.callback}/>
      </span>
		);
	}
};

export default Form.create()(SearchBar);
