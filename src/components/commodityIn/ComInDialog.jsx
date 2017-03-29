import React from 'react';
import { Modal, Select, message } from 'antd';
import Ajax from '../../util/Ajax';
import ComInForm from './ComInForm';

const ComInDialog = React.createClass({
  getInitialState() {
    return {
    };
  },
  componentWillMount() {

  },

  showModal() {
    this.setState({
      visible: true
    });
  },

  handleCancel() {
    this.setState({
      visible: false
    });
  },

  handleOk() {
    const comIns = this.refs.comIn.getFieldValue('comIns');

    for (const i in comIns) {
      if (!comIns[i].comId) {
        message.error("第" + comIns[i].key + "个商品为空");
        return;
      }

      if (!comIns[i].pricePi) {
        message.error("第" + comIns[i].key + "个商品的进价（支）未填写");
        return;
      }

      if (!comIns[i].num) {
        message.error("第" + comIns[i].key + "个商品的数量未填写");
        return;
      }
    }

    Ajax({
      url: '/ice/commodityIn/create.json',
      method: 'post',
      param: JSON.stringify(comIns),
      callback: (result) => {
        if (result.success) {
          this.handleCancel();
          message.success('入库成功');
          this.props.callback();
        } else {
          message.error('入库失败：' + result.errorMsg);
        }
      },
    });
  },

  render() {
    return (
      <div>
        <Modal title="入库" visible={this.state.visible} width="1200px"
               onOk={this.handleOk} onCancel={this.handleCancel}
        >
          <ComInForm ref="comIn" />
        </Modal>
      </div>
    );
  },
});

export default ComInDialog;
