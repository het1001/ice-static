import React from 'react';
import {Form, Input, InputNumber, Row, Col, Select} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;

import Ajax from '../../util/Ajax';
import styles from './CommodityForm.less';
import FileUpload from '../FileUpload';
import FileUploadMult from '../FileUploadMult';

class CommodityForm extends React.Component {
	constructor(props) {
		super(props);

		let priceBr = 0, standardPice = 0, pricePi = 0;
		if (props.com && props.com.priceBr && props.com.priceBr > 0) {
			standardPice = props.com.standardPice || 0;
			pricePi = props.com.pricePi || 0;
			priceBr = props.com.priceBr;
		}

		this.state = {
			visible: false,
			standardPice,
			pricePi,
			priceBr,
			brandData: [],
			packCatData: []
		};

		this.count = this.count.bind(this);
		this.showModal = this.showModal.bind(this);
		this.checkName = this.checkName.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.setFieldValue = this.setFieldValue.bind(this);
	}

	componentWillMount() {
		Ajax({
			url: '/ice/pc/brand/queryAll.json?',
			param: {},
			callback: (result) => {
				if (result.success) {
					this.setState({
						brandData: result.data
					});
				} else { }
			},
		});

		Ajax({
			url: '/ice/pc/cat/queryPackageList.json?',
			param: {},
			callback: (result) => {
				if (result.success) {
					this.setState({
						packCatData: result.data
					});
				} else { }
			},
		});
	}

	count() {
		if (this.state.standardPice > 0) {
			this.setState({
				priceBr: (this.state.pricePi / this.state.standardPice).toFixed(2)
			});
		} else {
			this.setState({
				priceBr: 0
			});
		}
	}

	showModal() {
		this.setState({
			visible: true
		});
	}

	checkName(value, callback) {
		if (!value) {
			callback();
			return;
		}

		Ajax({
			url: '/ice/pc/commodity/check.json',
			param: {
				id: this.props.com.id,
				name: value
			},
			callback: (result) => {
				if (result.success) {
					if (result.data) {
						callback();
					} else {
						callback([new Error('该名称已存在')]);
					}
				} else {
					callback([new Error(result.errorMsg)]);
				}
			},
		});
	}

	handleCancel() {
		this.setState({
			visible: false
		});
	}

	setButtonLoading() {
	}

	setFieldValue(key, value) {
		const obj = {};
		obj[key] = value;
		this.props.form.setFieldsValue(obj);
	}

	render() {
		const {getFieldDecorator, getFieldError} = this.props.form;

		return (
			<Form className="ant-advanced-search-form">
				<Row>
					<Col span={18}>
						<Row>
							<Col span={10}>
								<FormItem
									label="名称"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
									hasFeedback
									help={getFieldError('name')}
								>
									{getFieldDecorator('name', {
										rules: [
											{required: true, message: '名称不能为空'},
											{
												validator: (rule, value, callback) => {
													if (value && value.length > 45) {
														callback([new Error('长度不能超过45')]);
													} else {
														this.checkName(value, callback);
													}
												}
											},
										],
									})(
										<Input placeholder="输入名称" size="default"/>
									)}
								</FormItem>
								<FormItem
									label="规格(支)/件"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
									help={getFieldError('standardPice')}
								>
									{getFieldDecorator('standardPice', {
										rules: [
											{required: true, type: 'number', message: '规格不能为空'},
											{
												validator: (rule, value, callback) => {
													if (value.length > 20) {
														callback([new Error('长度不能超过20')]);
													} else {
														this.setState({
															standardPice: Number(value)
														}, this.count);
														callback();
													}
												}
											},
										]
									})(
										<InputNumber step={1} max={99999} size="default" className={styles.inputUnit}/>
									)} 支
								</FormItem>
								<FormItem
									label="上柜价/件"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
									help={getFieldError('pricePi')}
								>
									{getFieldDecorator('pricePi', {
										rules: [
											{required: true, type: 'number', message: '不能为空'},
											{
												validator: (rule, value, callback) => {

													this.setState({
														pricePi: Number(value)
													}, this.count);
													callback();
												}
											},
										]
									})(
										<InputNumber step={0.01} max={99999.99} size="default" className={styles.inputUnit}/>
									)} 元
								</FormItem>
								<FormItem
									label="建议零售价"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
								>
									{getFieldDecorator('retailPriceBr')(
										<InputNumber step={0.01} size="default" className={styles.inputUnit}/>
									)} 元
								</FormItem>
								<FormItem
									label="条形码"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
								>
									{getFieldDecorator('barCode')(
										<Input placeholder="输入条形码" size="default"/>
									)}
								</FormItem>
							</Col>
							<Col span={10}>
								<FormItem
									label="厂家/品牌"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
								>
									{getFieldDecorator('brandId')(
										<Select placeholder="请选择品牌">
											<Option value={0}>无</Option>
											{
												this.state.brandData.map(item => {
													return <Option value={item.id}>{item.name}</Option>
												})
											}
										</Select>
									)}
								</FormItem>
								<FormItem
									label="质量"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
									help={getFieldError('weight')}
								>
									{getFieldDecorator('weight')(
										<InputNumber step={1} max={99999} size="default" className={styles.inputUnit}/>
									)} g/支
								</FormItem>
								<FormItem
									label="上柜价/支"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
								>
									{this.state.priceBr} 元
								</FormItem>
								<FormItem
									label="针对人群"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
								>
									{getFieldDecorator('personType')(
										<Input size="default"/>
									)}
								</FormItem>
								<FormItem
									label="包装分类"
									labelCol={{span: 8}}
									wrapperCol={{span: 14}}
								>
									{getFieldDecorator('packCatId')(
										<Select placeholder="请选择所属包装类型">
											<Option value={0}>无</Option>
											{
												this.state.packCatData.map(item => {
													return <Option value={item.id}>{item.name}</Option>
												})
											}
										</Select>
									)}
								</FormItem>
							</Col>
						</Row>
						<Row>
							<Col span={10}>

							</Col>
						</Row>
						<Row>
							<Col span={20}>
								<FormItem
									label="口味介绍"
									labelCol={{span: 4}}
									wrapperCol={{span: 19}}
								>
									{getFieldDecorator('desc')(
										<Input.TextArea autosize={{minRows: 3, maxRows: 6}} size="default" style={{width: '100%'}}/>
									)}
								</FormItem>
							</Col>
						</Row>
					</Col>
					<Col span={6} pull={2}>
						<FormItem
							label=""
							labelCol={{span: 4}}
							wrapperCol={{span: 2}}
						>
							{getFieldDecorator('fileKey')(
								<FileUpload commodity={this.props.com} before={this.setButtonLoading} callback={this.setFieldValue}/>
							)}
						</FormItem>
						<FormItem
							label=""
							labelCol={{span: 4}}
							wrapperCol={{span: 16}}
						>
							{getFieldDecorator('fileKeys')(
								<FileUploadMult commodity={this.props.com} callback={this.setFieldValue}/>
							)}
						</FormItem>
					</Col>
				</Row>
			</Form>
		);
	}
};

export default Form.create({
	mapPropsToFields: (props) => {
		const {com} = props;

		return {
			name: Form.createFormField({
				value: com.name ? String(com.name) : '',
			}),
			weight: Form.createFormField({
				value: com.weight ? com.weight : '',
			}),
			standardPice: Form.createFormField({
				value: com.standardPice ? com.standardPice : 0,
			}),
			pricePi: Form.createFormField({
				value: com.pricePi || '',
			}),
			retailPriceBr: Form.createFormField({
				value: com.retailPriceBr || '',
			}),
			brandId: Form.createFormField({
				value: com.brandId || '',
			}),
			priceBr: Form.createFormField({
				value: com.priceBr || '',
			}),
			personType: Form.createFormField({
				value: com.personType || '',
			}),
			barCode: Form.createFormField({
				value: com.barCode || '',
			}),
			desc: Form.createFormField({
				value: com.desc || '',
			}),
			packCatId: Form.createFormField({
				value: com.packCatId || 0,
			})
		};
	}
})(CommodityForm);
