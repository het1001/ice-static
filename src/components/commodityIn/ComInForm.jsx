import React from 'react';
import {Form, Input, InputNumber, Row, Col, Icon, Button, Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
import Ajax from '../../util/Ajax';
import styles from './ComInForm.less';

let uuid = 1;
class ComInForm extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			comData: [],
			comDataMap: {},
			comInArray: [{
				key: 1,
				comId: '',
				standardPice: 0,
				pricePi: 0,
				priceBr: 0,
				num: 0,
				total: 0,
			}],
		};

		this.setValue = this.setValue.bind(this);
		this.getValues = this.getValues.bind(this);
		this.remove = this.remove.bind(this);
		this.add = this.add.bind(this);
		this.handleComChange = this.handleComChange.bind(this);
		this.handleNumChange = this.handleNumChange.bind(this);
	}

	componentWillMount() {
		Ajax({
			url: '/ice/pc/commodity/queryAll.json',
			param: {},
			callback: (result) => {
				if (result.success) {
					if (result.data && result.data.length > 0) {
						const comDataMap = {};
						for (let i in result.data) {
							comDataMap[result.data[i].id] = result.data[i];
						}

						this.setState({
							comDataMap,
							comData: result.data
						});
					}
				} else {
					this.setState({
						comData: []
					});
				}
			},
		});

		this.setValue(this.state.comInArray);
	}

	setValue(comInArray) {
		for (const i in comInArray) {
			comInArray[i].priceBr = (comInArray[i].pricePi / comInArray[i].standardPice).toFixed(2);
			comInArray[i].total = (comInArray[i].num * comInArray[i].pricePi).toFixed(2);
		}

		this.setState({
			comInArray
		});
	}

	getValues() {
		return this.state.comInArray;
	}

	remove(k) {
		const comInArray = this.state.comInArray;
		if (comInArray.length === 1) {
			return;
		}

		this.setValue(comInArray.filter(key => key.key !== k));
	}

	add() {
		uuid++;

		const comInArray = this.state.comInArray;
		comInArray.push({
			key: uuid,
			comId: '',
			standardPice: 0,
			pricePi: 0,
			priceBr: 0,
			num: 0,
			total: 0,
		});
		this.setValue(comInArray);
	}

	handleComChange(k, value) {
		const com = this.state.comDataMap[value];
		const comInArray = this.state.comInArray;

		for (let i in comInArray) {
			if (comInArray[i].key === k) {
				comInArray[i].comId = value;
				comInArray[i].standardPice = com.standardPice;
				break;
			}
		}

		this.setValue(comInArray);
	}

	handleNumChange(name, k, value) {
		const comInArray = this.state.comInArray;
		if (name === 'pricePi') {
			for (let i in comInArray) {
				if (comInArray[i].key === k) {
					comInArray[i].pricePi = value;
					break;
				}
			}
		} else if (name === 'num') {
			for (let i in comInArray) {
				if (comInArray[i].key === k) {
					comInArray[i].num = value;
					break;
				}
			}
		}

		this.setValue(comInArray);
	}

	render() {
		const formItemLayoutWithOutLabel = {
			wrapperCol: {span: 20, offset: 4},
		};

		const formItems = this.state.comInArray.map((comIn, index) => {
			return (
				<Row gutter={16}>
					<Col span={6} key={index + "com" + 1}>
						<FormItem
							labelCol={{span: 8}}
							wrapperCol={{span: 16}}
							label={comIn.key + " 商品"}>
							<Select
								size="small"
								showSearch
								key={index + "select"}
								style={{width: '100%'}}
								optionFilterProp="children"
								onChange={this.handleComChange.bind(this, comIn.key)}
							>
								{
									this.state.comData.map((item) => {
										return <Option key={item.id} value={String(item.id)}>{item.name}</Option>;
									})
								}
							</Select>
						</FormItem>
					</Col>
					<Col span={3} key={index + "tt" + 1}>
						<FormItem
							labelCol={{span: 10}}
							wrapperCol={{span: 14}}
							label="规格">
							<span>{comIn.standardPice + " 支/件"}</span>
						</FormItem>
					</Col>
					<Col span={4} key={index + "dd" + 1}>
						<FormItem
							labelCol={{span: 10}}
							wrapperCol={{span: 14}}
							label="进价（件）">
							<InputNumber style={{width: 72}} size="small" step={0.01} max={99999.99}
													 onChange={this.handleNumChange.bind(this, 'pricePi', comIn.key)}/> 元
						</FormItem>
					</Col>
					<Col span={3} key={index + "aa" + 1}>
						<FormItem
							labelCol={{span: 16}}
							wrapperCol={{span: 8}}
							label="进价（支）">
							<span>{comIn.priceBr + " 元"}</span>
						</FormItem>
					</Col>
					<Col span={4} key={index + "bb" + 1}>
						<FormItem
							labelCol={{span: 6}}
							wrapperCol={{span: 18}}
							label="数量">
							<InputNumber style={{width: 52}} size="small" step={1} max={99999}
													 onChange={this.handleNumChange.bind(this, 'num', comIn.key)}/> 件
						</FormItem>
					</Col>
					<Col span={3} key={index + "ff" + 1}>
						<FormItem
							labelCol={{span: 8}}
							wrapperCol={{span: 16}}
							label="总价">
							<span>{comIn.total + " 元"}</span>
						</FormItem>
					</Col>
					<Col span={1} key={index + "ee" + 1}>
						<Icon
							className="delete-button"
							type="minus-circle-o"
							disabled={this.state.comInArray.length === 1}
							onClick={() => this.remove(comIn.key)}
						/>
					</Col>
				</Row>
			);
		});

		return (
			<Form>
				{formItems}
				<FormItem {...formItemLayoutWithOutLabel}>
					<Button type="dashed" onClick={this.add} style={{width: '60%'}}>
						<Icon type="plus"/> 添加
					</Button>
				</FormItem>
			</Form>
		);
	}
};

export default ComInForm;
