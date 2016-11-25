import React from 'react';
import { Select } from 'antd';
const Option = Select.Option;
import Ajax from '../../util/Ajax';

const CommoditySelect = React.createClass({
  getInitialState() {
    return {
      data: [],
    };
  },
  componentWillMount() {
    Ajax({
      url: '/ice/commodity/queryAll.json',
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
  },

  handleChange() {

  },

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
  },
});

export default CommoditySelect;