import React from 'react';
import CommodityList from './commodity/CommodityList';
import ComInList from './commodityIn/ComInList';
import NewOrder from './order/NewOrder';
import UserList from './user/UserList';
import AppMainImgList from './appmainimg/AppMainImgList';
import DistrictList from './allot/district/DistrictList';
import SalesmanList from './allot/salesman/SalesmanList';
import PromotionList from './promotion/PromotionList';

const Main = React.createClass({
  getInitialState() {
    return {
      pageKey: this.props.currentMenu,
    };
  },
  changePage(key) {
    this.setState({
      pageKey: key
    });
  },

  render() {
    let page = <span>功能建设中，敬请期待... ...</span>;
    switch (this.state.pageKey) {
      case 'commodity_list':
          page = <CommodityList />
          break;
      case 'commodityIn_list':
          page = <ComInList />
          break;
      case 'new_order':
          page = <NewOrder />
          break;
      case 'person':
          page = <UserList />
          break;
      case 'main_img_set':
          page = <AppMainImgList />
          break;
      case 'district':
          page = <DistrictList />;
          break;
			case 'salesman':
				page = <SalesmanList />;
				break;
      case 'promotion_list':
        page = <PromotionList />;
        break;
      default:
    }

      return (
      <div style={{ width:'80%', paddingLeft:'30px', float: 'left'}}>
        {page}
      </div>
    );
  },
});

export default Main;
