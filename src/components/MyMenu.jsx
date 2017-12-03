import React from 'react';
import {Menu, Icon} from 'antd';

const SubMenu = Menu.SubMenu;

const subMenus = {
	cat_list: ['sub1'],
	commodity_list: ['sub1'],
	promotion_list: ['sub1'],
	commodityIn_list: ['sub1'],
	new_order: ['sub2'],
	verify_order: ['sub2'],
	cancel_order: ['sub2'],
	complete_order: ['sub2'],
	all_order: ['sub2'],
	person: ['sub3'],
	position: ['sub3'],
	district: ['sub4', 'dist_set'],
	salesman: ['sub4', 'dist_set'],
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
				style={{width: 240, float: 'left'}}
				defaultOpenKeys={subMenus[this.state.current]}
				selectedKeys={this.state.current}
				mode="inline"
			>
				<SubMenu key="sub1" title={<span><Icon type="appstore-o"/><span>商品管理</span></span>}>
					<Menu.Item key="cat_list"><Icon type="bars"/>类型管理</Menu.Item>
					<Menu.Item key="commodity_list"><Icon type="bars"/>商品管理</Menu.Item>
					<Menu.Item key="promotion_list"><Icon type="calculator"/>促销管理</Menu.Item>
					<Menu.Item key="commodityIn_list"><Icon type="scan"/>入库管理</Menu.Item>
				</SubMenu>
				<SubMenu key="sub2" title={<span><Icon type="appstore"/><span>订单管理</span></span>}>
					<Menu.Item key="new_order"><Icon type="file-unknown"/>新订单</Menu.Item>
					<Menu.Item key="verify_order"><Icon type="file-unknown"/>确认的订单</Menu.Item>
					<Menu.Item key="cancel_order"><Icon type="file-unknown"/>取消的订单</Menu.Item>
					<Menu.Item key="complete_order"><Icon type="file-unknown"/>完成的订单</Menu.Item>
					<Menu.Item key="all_order"><Icon type="file"/>全部订单</Menu.Item>
				</SubMenu>
				<SubMenu key="sub3" title={<span><Icon type="team"/><span>会员管理</span></span>}>
					<Menu.Item key="person"><Icon type="user"/>会员信息</Menu.Item>
					<Menu.Item key="posion"><Icon type="environment-o"/>位置分布</Menu.Item>
				</SubMenu>
				<SubMenu key="sub4" title={<span><Icon type="setting"/><span>系统设置</span></span>}>
					<SubMenu key="dist_set" title={<span><Icon type="rocket"/><span>配送设置</span></span>}>
						<Menu.Item key="district"><Icon type="share-alt"/>片区管理</Menu.Item>
						<Menu.Item key="salesman"><Icon type="customer-service"/>业务员管理</Menu.Item>
					</SubMenu>
					<Menu.Item key="main_img_set"><Icon type="tablet"/>APP广告设置</Menu.Item>
				</SubMenu>
			</Menu>
		);
	},
});

export default MyMenu;
