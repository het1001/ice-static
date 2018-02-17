import React from 'react';
import {Icon, Modal, Upload, message} from 'antd';

import './fileUploadMult.less';

import Ajax from '../util/Ajax';

class FileUploadMult extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			previewVisible: false,
			previewImage: '',
			fileList: []
		};

		this.reloadFile = this.reloadFile.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	componentWillMount() {
		this.reloadFile(this.props);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.value !== nextProps.value || this.props.commodity.id !== nextProps.commodity.id) {
			this.reloadFile(nextProps);
		}
	}

	reloadFile(props) {
		if (props.value) {
			this.setState({
				fileList: props.value.map((item) => {
					return {
						key: item,
						uid: item,
						name: item,
						url: 'http://ice2016.oss-cn-hangzhou.aliyuncs.com/' + item,
						response: {
							data: item
						},
						status: 'done',
					};
				})
			});
		} else {
			if (!props.commodity) {
				this.setState({
					fileList: []
				});
				return;
			}

			if (props.commodity.id) {
				Ajax({
					url: '/ice/pc/commodityPic/queryOtherPicKeys.json',
					param: {
						comId: props.commodity.id
					},
					callback: (result) => {
						if (result.success && result.data) {
							this.props.callback('fileKeys', result.data.map((item) => {
								return item.picKey
							}));

							this.setState({
								fileList: result.data.map((item) => {
									return {
										key: item.id,
										uid: item.id,
										name: item.picKey,
										url: 'http://ice2016.oss-cn-hangzhou.aliyuncs.com/' + item.picKey,
										response: {
											data: item.picKey
										},
										status: 'done',
									};
								})
							});
						} else {

						}
					},
				});
			}
		}
	}

	handleCancel() {
		this.setState({previewVisible: false});
	}

	render() {
		const props = {
			beforeUpload: (file) => {
				if (file.size > 10 * 1024 * 1024) {
					message.error("文件大小不能超过10M");
					return false;
				}

				if (this.props.before) {
					this.props.before();
				}

				return true;
			},
			onChange: ({fileList}) => {
				this.setState({fileList}, () => {
					let uploadDone = true;

					for (let i in fileList) {
						if (fileList[i].status !== 'done') {
							uploadDone = false;
						}
					}

					if (uploadDone) {
						this.props.callback('fileKeys', fileList.map((item) => {
							return item.response.data
						}));
					}
				});
			},
			onPreview: (file) => {
				this.setState({
					previewImage: file.url || file.thumbUrl,
					previewVisible: true,
				});
			}
		};

		const {previewVisible, previewImage, fileList} = this.state;

		const uploadButton = (
			<div>
				<Icon type="plus"/>
			</div>
		);

		return (
			<div className="clearfix" style={{width: '350px'}}>
				<Upload
					action="/ice/common/upload"
					listType="picture-card"
					fileList={fileList}
					onPreview={this.handlePreview}
					{...props}
				>
					{fileList.length >= 5 ? null : uploadButton}
				</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{width: '100%'}} src={previewImage}/>
				</Modal>
			</div>
		);
	}
};

export default FileUploadMult;
