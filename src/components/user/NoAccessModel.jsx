import React from 'react';

import {Modal} from 'antd';

class NoAccessModel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};

		this.showModal = this.showModal.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	showModal() {
		this.setState({
			visible: true
		});
	}

	handleCancel() {
		this.setState({
			visible: false
		});
	}

	render() {
		return (
			<div>
				<Modal title="审核备注" visible={this.state.visible}
							 footer={null}
							 onCancel={this.handleCancel}
				>

				</Modal>
			</div>
		);
	}
};

export default NoAccessModel;
