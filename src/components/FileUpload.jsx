import React from 'react';
import { Icon, Input, InputNumber, Row, Col, Modal, Upload, message } from 'antd';
const Dragger = Upload.Dragger;

const FileUpload = React.createClass({
  getInitialState() {
    return {
      fileKey: '',
    };
  },
  componentWillMount() {
    this.reloadFile(this.props);
  },

  componentWillReceiveProps(nextProps) {
    this.reloadFile(nextProps);
  },

  reloadFile(props) {
    let fileKey = '';
    if (props.value) {
      fileKey = props.value;
    }

    this.setState({
      fileKey,
    });
  },

  render() {
    const props = {
      action: '/ice/common/upload',
      showUploadList: false,
      beforeUpload: (file) => {
        if (file.size > 10*1024*1024) {
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

          this.props.callback(info.file.response.data);
          message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 上传失败`);
        }
      },
    };

    return (
      <div style={{ width: 200, height: 200, marginLeft: 50 }}>
        <Dragger {...props}>
          {this.state.fileKey ?
            <img alt="example" width="200px" height="200px" src={"http://ice2016.oss-cn-hangzhou.aliyuncs.com/" + this.state.fileKey} />
            :
            <Icon type="plus" />}
        </Dragger>
      </div>
    );
  },
});

export default FileUpload;
