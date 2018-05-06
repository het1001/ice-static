import React from 'react';
import {Form, Select, Modal, message, Input, InputNumber, DatePicker} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

import Ajax from '../../util/Ajax';
import CommonUtil from '../../util/CommonUtil';

class PromotionDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			id: 0,
			comId: '',
			arithId: '',
			desc: '',
			params: {},
			effectiveDate: '',
			deadline: ''
		};

		this.showModal = this.showModal.bind(this);
		this.onInputChange = this.onInputChange.bind(this);
		this.onArithChange = this.onArithChange.bind(this);
		this.handleSelectChange = this.handleSelectChange.bind(this);
		this.onDateChange = this.onDateChange.bind(this);
		this.onParamChange = this.onParamChange.bind(this);
	}

	componentWillMount() {
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.isEdit) {
			this.setState({
				id: nextProps.obj.id,
				comId: nextProps.obj.comId,
				arithId: nextProps.obj.arithId,
				desc: nextProps.obj.desc,
				params: nextProps.obj.params,
				effectiveDate: CommonUtil.pareDate2(nextProps.obj.effectiveDate),
				deadline: CommonUtil.pareDate2(nextProps.obj.deadline),
				funcKeys: JSON.parse(nextProps.arithmeticMap[nextProps.obj.arithId].funcKeys),
			});
		}
	}

	showModal(isAdd) {
		if (!isAdd) {

		} else {
			this.setState({
				id: 0,
				comId: '',
				arithId: '',
				desc: '',
				params: {},
				effectiveDate: '',
				deadline: '',
				funcKeys: '',
			});
		}

		this.setState({
			visible: true
		});
	}

	handleOk() {
		if (!this.state.comId) {
			message.error("商品不能为空");
			return;
		}

		if (!this.state.arithId) {
			message.error("促销方式不能为空");
			return;
		}

		if (!this.state.desc) {
			message.error("促销描述不能为空");
			return;
		}

		if (!this.state.effectiveDate) {
			message.error("时间范围不能为空");
			return;
		}

		const params = {};
		params.id = this.state.id;
		params.comId = this.state.comId;
		params.arithId = this.state.arithId;
		params.desc = this.state.desc;
		params.params = JSON.stringify(this.state.params);
		params.effectiveDate = this.state.effectiveDate;
		params.deadline = this.state.deadline;

		if (!this.props.isEdit) {
			Ajax({
				url: '/ice/pc/promotion/create.json',
				method: 'post',
				param: JSON.stringify(params),
				callback: (result) => {
					if (result.success) {
						this.handleCancel();
						message.success('新增成功');
						this.props.callback();
					} else {
						message.error('新增失败：' + result.errorMsg);
					}
				},
			});
		} else {
			Ajax({
				url: '/ice/pc/promotion/update.json',
				method: 'post',
				param: JSON.stringify(params),
				callback: (result) => {
					if (result.success) {
						this.handleCancel();
						message.success('更新成功');
						this.props.callback();
					} else {
						message.error('更新失败：' + result.errorMsg);
					}
				},
			});
		}
	}

	handleCancel() {
		this.setState({
			visible: false
		});
	}

	onInputChange(key, e) {
		this.state[key] = e.target.value;
		this.setState({});
	}

	onArithChange(arithId) {
		this.setState({
			funcKeys: JSON.parse(this.props.arithmeticMap[arithId].funcKeys),
			arithId,
			params: {},
		});
	}

	handleSelectChange(key, e) {
		this.state[key] = e;
		this.setState({});
	}

	onDateChange(date, dateString) {
		this.setState({
			effectiveDate: dateString[0],
			deadline: dateString[1]
		});
	}

	onParamChange(key, value) {
		this.state.params[key] = value;
		this.setState({});
	}

	render() {
		const formItemLayout = {
			labelCol: {
				xs: {span: 24},
				sm: {span: 6},
			},
			wrapperCol: {
				xs: {span: 24},
				sm: {span: 14},
			},
		};

		return (
			<div>
				<Modal title="新增" visible={this.state.visible} width="700px"
							 maskClosable={false}
							 onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
				>
					<Form>
						<FormItem
							{...formItemLayout}
							label="商品"
							required
						>
							<Select
								showSearch
								disabled={this.props.isEdit ? true : false}
								style={{width: '100%'}}
								optionFilterProp="children"
								value={this.state.comId}
								onChange={this.handleSelectChange.bind(this, 'comId')}
							>
								{
									this.props.comData.map((item) => {
										return <Option key={item.id} value={item.id}>{item.name}</Option>;
									})
								}
							</Select>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="促销方式"
							required
						>
							<Select
								showSearch
								style={{width: '100%'}}
								optionFilterProp="children"
								value={this.state.arithId}
								onChange={this.onArithChange}
							>
								{
									this.props.arithmetic.map((item) => {
										return <Option key={item.id} value={item.id}>{item.name}</Option>;
									})
								}
							</Select>
						</FormItem>
						{this.state.funcKeys ? this.state.funcKeys.map((item) => {
							return <FormItem
								{...formItemLayout}
								label={"其中 " + item.key + "="}
								required
							>
								{
									(() => {
										switch (item.type) {
											case 'inputNum':
												return <InputNumber style={{width: '50%'}} value={this.state.params[item.key]}
																						onChange={this.onParamChange.bind(this, item.key)}/>
											case 'commodity':
												return <Select
													showSearch
													style={{width: '100%'}}
													optionFilterProp="children"
													value={this.state.params[item.key]}
													onChange={this.onParamChange.bind(this, item.key)}
												>
													{
														this.props.comData.map((item) => {
															return <Option key={item.id} value={item.id}>{item.name}</Option>;
														})
													}
												</Select>
											default:
												return null
										}
									})()
								}
							</FormItem>
						}) : null}
						<FormItem
							{...formItemLayout}
							label="促销描述"
							required
						>
							<TextArea rows={4} onChange={this.onInputChange.bind(this, 'desc')} value={this.state.desc}/>
						</FormItem>
						<FormItem
							{...formItemLayout}
							label="生效时间范围"
							required
						>
							<RangePicker
								value={this.state.effectiveDate ? [moment(this.state.effectiveDate, dateFormat), moment(this.state.deadline, dateFormat)] : []}
								onChange={this.onDateChange}/>
						</FormItem>
					</Form>
				</Modal>
			</div>
		);
	}
};

export default PromotionDialog;
