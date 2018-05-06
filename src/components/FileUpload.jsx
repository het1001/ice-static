import React from 'react';
import {Icon, Upload, message} from 'antd';

const Dragger = Upload.Dragger;

import Ajax from '../util/Ajax';

class FileUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fileKey: '',
		};

		this.reloadFile = this.reloadFile.bind(this);
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
		if (props.value && props.value !== this.state.fileKey) {
			this.setState({
				fileKey: props.value
			});
		} else {
			if (!props.commodity) {
				this.setState({
					fileKey: ''
				});
				return;
			}

			Ajax({
				url: '/ice/pc/commodityPic/getMainPicKey.json',
				param: {
					comId: props.commodity.id
				},
				callback: (result) => {
					if (result.success && result.data) {
						this.setState({
							fileKey: result.data.picKey
						});
						this.props.callback('fileKey', result.data.picKey);
					} else {

					}
				},
			});
		}
	}

	render() {
		const props = {
			action: '/ice/common/upload',
			showUploadList: false,
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
			onChange: (info) => {
				if (info.file.status !== 'uploading') {
					console.log(info.file, info.fileList);
				}
				if (info.file.status === 'done') {
					this.setState({
						fileKey: info.file.response.data
					});

					this.props.callback('fileKey', info.file.response.data);
					// message.success(`${info.file.name} 上传成功`);
				} else if (info.file.status === 'error') {
					message.error(`${info.file.name} 上传失败`);
				}
			},
		};

		return (
			<div style={{width: 200, height: 200, marginLeft: 50}}>
				<Dragger {...props}>
					{this.state.fileKey ?
						<img alt="example" width="200px" height="200px"
								 src={"http://ice2016.oss-cn-hangzhou.aliyuncs.com/" + this.state.fileKey}/>
						:
						<Icon type="plus"/>}
				</Dragger>
			</div>
		);
	}
};

export default FileUpload;
