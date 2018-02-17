import React from 'react';

import {Modal} from 'antd';

class ImgNativeShow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			width: 300,
		};

		this.resetWidth = this.resetWidth.bind(this);
		this.showModal = this.showModal.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	componentWillMount() {
		this.resetWidth();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.imgKey !== nextProps.imgKey) {
			this.resetWidth(nextProps.imgKey);
		}
	}

	resetWidth(imgKey) {
		let imgKeyR = imgKey ? imgKey : this.props.imgKey;
		if (imgKeyR) {
			var img = new Image();
			img.src = "http://ice2016.oss-cn-hangzhou.aliyuncs.com/" + imgKeyR;
			if (img.complete) {
				this.setState({
					width: img.width + 30
				});
			} else {
				img.onload = () => {
					this.setState({
						width: img.width + 30
					});
				};
			}
		}
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
				<Modal width={this.state.width}
							 title={this.props.title}
							 visible={this.state.visible}
							 footer={null}
							 onCancel={this.handleCancel}
				>
					<img src={"http://ice2016.oss-cn-hangzhou.aliyuncs.com/" + this.props.imgKey}/>
				</Modal>
			</div>
		);
	}
};

export default ImgNativeShow;
