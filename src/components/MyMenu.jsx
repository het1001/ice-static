import React from 'react';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;

const subMenus = {
  commodity_list: ['sub1'],
  commodityIn_list: ['sub1'],
  new_order: ['sub2'],
  no_out_order: ['sub2'],
  no_to_order: ['sub2'],
  success_order: ['sub2'],
  back_order: ['sub2'],
  all_order: ['sub2'],
  person: ['sub3'],
  position: ['sub3'],
  dist_set: ['sub4'],
  main_img_set: ['sub4'],
}

const MyMenu = React.createClass({
  getInitialState() {
    return {
      current: this.props.currentMenu,
    };
  },
  handleClick(e) {
    this.setState({
      current: e.key,
    });
    window.location.hash = e.key;
    this.props.callback(e.key);
  },
  render() {
    return (
      <Menu
          onClick={this.handleClick}
          style={{ width: 240, float: 'left'}}
          defaultOpenKeys={subMenus[this.state.current]}
          selectedKeys={this.state.current}
          mode="inline"
      >
        <SubMenu key="sub1" title={<span><Icon type="appstore-o" /><span>商品管理</span></span>}>
          <Menu.Item key="commodity_list"><Icon type="bars" />商品列表</Menu.Item>
          <Menu.Item key="commodityIn_list"><Icon type="scan" />入库管理</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" title={<span><Icon type="appstore" /><span>订单管理</span></span>}>
          <Menu.Item key="new_order"><Icon type="file-unknown" />新订单</Menu.Item>
          <Menu.Item key="no_out_order"><Icon type="file" />待出货订单</Menu.Item>
          <Menu.Item key="no_to_order"><Icon type="file" />未送达订单</Menu.Item>
          <Menu.Item key="success_order"><Icon type="file" />已完结订单</Menu.Item>
          <Menu.Item key="back_order"><Icon type="file" />退订订单</Menu.Item>
          <Menu.Item key="all_order"><Icon type="file" />全部订单</Menu.Item>
        </SubMenu>
        <SubMenu key="sub3" title={<span><Icon type="team" /><span>会员管理</span></span>}>
          <Menu.Item key="person"><Icon type="user" />会员信息</Menu.Item>
          <Menu.Item key="posion"><Icon type="environment-o" />位置分布</Menu.Item>
        </SubMenu>
        <SubMenu key="sub4" title={<span><Icon type="setting" /><span>系统设置</span></span>}>
          <Menu.Item key="dist_set"><Icon type="phone" />配送设置</Menu.Item>
          <Menu.Item key="main_img_set"><Icon type="tablet" />APP广告设置</Menu.Item>
          <SubMenu key="sub5" title="其他">
            <Menu.Item key="7">Option 7</Menu.Item>
            <Menu.Item key="8">Option 8</Menu.Item>
          </SubMenu>
        </SubMenu>
      </Menu>
    );
  },
});

export default MyMenu;
