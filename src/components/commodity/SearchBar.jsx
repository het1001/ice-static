import React from 'react';
import {Form, Input, Row, Col, Select, Button, DatePicker, Checkbox} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
import CommodityDialog from './CommodityDialog';

class SearchBar extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			status: false,
		};

		this.newCom = this.newCom.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.onStatusChange = this.onStatusChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	newCom() {
		this.refs.commodityDialog.showModal();
	}

	handleReset(e) {
		e.preventDefault();
		this.props.form.resetFields();
	}

	onStatusChange(e) {
		this.setState({
			status: e.target.checked
		}, () => {
			this.handleSubmit();
		});
	}

	handleSubmit(e) {
		e && e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				console.log('Errors in form!!!');
				return;
			}

			values.status = this.state.status ? 1 : '';
			this.props.callback(values);
		});
	}

	render() {
		const {getFieldDecorator} = this.props.form;

		return (
			<span>
        <Form className="ant-advanced-search-form">
          <Row gutter={24}>
            <Col sm={6}>
              <FormItem
								label="名称"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('name')(
									<Input placeholder="输入名称" size="default"/>
								)}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem
								label="厂家/品牌"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
								{getFieldDecorator('brandId')(
									<Select placeholder="请选择品牌">
										<Option value={0}>无</Option>
										{
											this.props.brandData.map(item => {
												return <Option value={item.id}>{item.name}</Option>
											})
										}
									</Select>
								)}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem
								label="状态"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                <Checkbox onChange={this.onStatusChange} checked={this.state.status}>上线的</Checkbox>
              </FormItem>
            </Col>
						<Col sm={6}>
            </Col>
          </Row>
					<Row>
            <Col sm={6}>
              <FormItem
								label="价格分类"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('pricCatId')(
									<Select placeholder="请选择价格类型">
										<Option value={0}>无</Option>
										{
											this.props.pricCatData.map(item => {
												return <Option value={item.id}>{item.name}</Option>
											})
										}
									</Select>
								)}
              </FormItem>
            </Col>
						<Col sm={6}>
              <FormItem
								label="包装分类"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('packCatId')(
									<Select placeholder="请选择所属包装类型">
										<Option value={0}>无</Option>
										{
											this.props.packCatData.map(item => {
												return <Option value={item.id}>{item.name}</Option>
											})
										}
									</Select>
								)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={2} offset={1} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} onClick={this.newCom}>新增商品</Button>
            </Col>
            <Col span={15} offset={3} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} htmlType="submit"
											onClick={this.handleSubmit}>搜索</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        <CommodityDialog ref="commodityDialog" type="new" com={{}} callback={this.props.callback}/>
      </span>
		);
	}
};

export default Form.create()(SearchBar);
