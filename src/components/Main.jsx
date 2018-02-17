import React from 'react';
import CommodityList from './commodity/CommodityList';
import ComInList from './commodityIn/ComInList';
import NewOrder from './order/NewOrderList';
import VerifyOrderList from './order/VerifyOrderList';
import CanceledOrderList from './order/CanceledOrderList';
import CompletedOrderList from './order/CompletedOrderList';
import UserList from './user/UserList';
import AppMainImgList from './appmainimg/AppMainImgList';
import DistrictList from './allot/district/DistrictList';
import SalesmanList from './allot/salesman/SalesmanList';
import PromotionList from './promotion/PromotionList';
import BrandList from './brand/BrandList';
import PriceCatList from './cat/PriceCatList';
import PackageCatList from './cat/PackageCatList';

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pageKey: this.props.currentMenu,
		};
	}

	changePage = (key) => {
		this.setState({
			pageKey: key
		});
	}

	render() {
		let page = <span>功能建设中，敬请期待... ...</span>;
		switch (this.state.pageKey) {
			case 'commodity_list':
				page = <CommodityList/>
				break;
			case 'commodityIn_list':
				page = <ComInList/>
				break;
			case 'new_order':
				page = <NewOrder/>
				break;
			case 'verify_order':
				page = <VerifyOrderList/>
				break;
			case 'cancel_order':
				page = <CanceledOrderList/>
				break;
			case 'complete_order':
				page = <CompletedOrderList />
				break;
			case 'person':
				page = <UserList/>
				break;
			case 'main_img_set':
				page = <AppMainImgList/>
				break;
			case 'district':
				page = <DistrictList/>;
				break;
			case 'salesman':
				page = <SalesmanList/>;
				break;
			case 'promotion_list':
				page = <PromotionList/>;
				break;
			case 'brand_cat':
				page = <BrandList />;
				break;
			case 'price_cat':
				page = <PriceCatList />;
				break;
			case 'pack_cat':
				page = <PackageCatList />;
				break;
			default:
		}

		return (
			<div style={{width: '88%', padding: '30px', float: 'left'}}>
				{page}
			</div>
		);
	}
};

export default Main;
