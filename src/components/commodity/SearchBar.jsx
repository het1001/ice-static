import React from 'react';
import { Form, Input, Row, Col, Icon, Button, DatePicker, Checkbox } from 'antd';
const FormItem = Form.Item;
import CommodityDialog from './CommodityDialog';

const SearchBar = React.createClass({
  getInitialState() {
    return {
      status: false,
    };
  },

  newCom() {
    this.refs.commodityDialog.showModal();
  },

  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  onStatusChange(e) {
    this.setState({
      status: e.target.checked
    }, () => {
      this.handleSubmit();
    });
  },

  handleSubmit(e) {
    e && e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        console.log('Errors in form!!!');
        return;
      }

      values.status = this.state.status ? 1 : '',

      this.props.callback(values);
    });
  },

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <span>
        <Form horizontal className="ant-advanced-search-form" >
          <Row gutter={16}>
            <Col sm={6}>
              <FormItem
                label="名称"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
                {getFieldDecorator('name')(
                  <Input placeholder="输入名称" size="default" />
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem
                label="厂家/品牌"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
                {getFieldDecorator('brand')(
                  <Input placeholder="请输入厂家/品牌" size="default" />
                )}
              </FormItem>
            </Col>
            <Col sm={6}>
              <FormItem
                label="状态"
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
              >
                <Checkbox onChange={this.onStatusChange} checked={this.state.status}>上线的</Checkbox>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={2} offset={1} style={{ textAlign: 'right' }}>
              <Button type="primary" style={{ marginRight: '30px' }} onClick={this.newCom}>新增商品</Button>
            </Col>
            <Col span={10} offset={3} style={{ textAlign: 'right' }}>
              <Button type="primary" style={{ marginRight: '30px' }} htmlType="submit" onClick={this.handleSubmit} >搜索</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        <CommodityDialog ref="commodityDialog" type="new" com={{}} callback={this.props.callback} />
      </span>
    );
  },
});

export default Form.create()(SearchBar);
