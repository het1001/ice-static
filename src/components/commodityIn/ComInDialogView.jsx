import React from 'react';
import { Modal, Table } from 'antd';
import Ajax from '../../util/Ajax';

const ComInDialogView = React.createClass({
  getInitialState() {
    return {
      data: [],
    };
  },
  componentWillMount() {

  },

  fetch() {
    Ajax({
      url: '/ice/pc/commodityIn/queryDetail.json',
      param: {
        inId: this.props.inId
      },
      callback: (result) => {
        if (result.success) {
          this.setState({
            data: result.data.map((item) => {
              item.key = item.id;
              return item;
            })
          });
        } else {

        }
      },
    });
  },

  showModal() {
    this.setState({
      visible: true
    });

    this.fetch();
  },

  handleCancel() {
    this.setState({
      visible: false
    });
  },

  handleOk() {
  },

  render() {
    const columns = [
      {
        title: '序号',
        width: '5%',
        dataIndex: 'id',
      }, {
        title: '商品',
        width: '10%',
        dataIndex: 'comName',
      }, {
        title: '规格',
        width: '10%',
        dataIndex: 'comStandard',
        render: (text, record) => (
          <span>
            {text} 支/件
          </span>
        ),
      }, {
        title: '进价（件）',
        width: '10%',
        dataIndex: 'pricePi',
        render: (text, record) => (
          <span>
            {String(text)} 元
          </span>
        ),
      }, {
        title: '进价（支）',
        width: '10%',
        dataIndex: 'priceBr',
        render: (text, record) => (
          <span>
            {String(text)} 元
          </span>
        ),
      }, {
        title: '数量',
        width: '10%',
        dataIndex: 'num',
        render: (text, record) => (
          <span>
            {String(text)} 件
          </span>
        ),
      }, {
        title: '总价',
        width: '10%',
        dataIndex: 'total',
        render: (text, record) => (
          <span>
            {String(text)} 元
          </span>
        ),
      }];

    return (
      <div>
        <Modal title="入库详情" visible={this.state.visible} width="800px"
               onCancel={this.handleCancel}
        >
          <Table
            pagination={false}
            dataSource={this.state.data}
            columns={columns}
          />
        </Modal>
      </div>
    );
  },
});

export default ComInDialogView;
