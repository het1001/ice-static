import React from 'react';
import {Select} from 'antd';

const Option = Select.Option;
import Ajax from '../../util/Ajax';

class CommoditySelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
		};

		this.handleChange = this.handleChange.bind(this);
	}

	componentWillMount() {
		Ajax({
			url: '/ice/pc/commodity/queryAll.json',
			param: {},
			callback: (result) => {
				if (result.success) {
					this.setState({
						data: result.data
					});
				} else {
					this.setState({
						data: []
					});
				}
			},
		});
	}

	handleChange() {

	}

	render() {
		return (
			<div>
				<Select
					showSearch
					onChange={this.handleChange}
				>
					{
						this.state.data.map((item) => {
							return <Option value={item.id}>{item.name}</Option>;
						})
					}
				</Select>
			</div>
		);
	}
};

export default CommoditySelect;
