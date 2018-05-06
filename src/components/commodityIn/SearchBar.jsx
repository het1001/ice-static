import React from 'react';
import {Form, Row, Col, Icon, Button, DatePicker} from 'antd';

const RangePicker = DatePicker.RangePicker;
const FormItem = Form.Item;
import ComInDialog from './ComInDialog';

class SearchBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.newComIn = this.newComIn.bind(this);
		this.handleReset = this.handleReset.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	newComIn() {
		this.refs.comInDialog.showModal();
	}

	handleReset(e) {
		e.preventDefault();
		this.props.form.resetFields();
	}

	handleSubmit(e) {
		e.preventDefault();
		this.props.form.validateFields((errors, values) => {
			if (errors) {
				console.log('Errors in form!!!', errors);
				return;
			}

			if (values.time) {
				values.fromTime = values.time[0].format("YYYY-MM-DD");
				values.endTime = values.time[1].format("YYYY-MM-DD");
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
            <Col sm={10}>
              <FormItem
								label="时间范围"
								labelCol={{span: 10}}
								wrapperCol={{span: 14}}
							>
                {getFieldDecorator('time')(
									<RangePicker/>
								)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={2} offset={1} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} onClick={this.newComIn}>进货</Button>
            </Col>
            <Col span={10} offset={3} style={{textAlign: 'right'}}>
              <Button type="primary" style={{marginRight: '30px'}} htmlType="submit"
											onClick={this.handleSubmit}>搜索</Button>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </Form>
        <ComInDialog ref="comInDialog" type="new" com={{}} callback={this.props.callback}/>
      </span>
		);
	}
};

export default Form.create()(SearchBar);
