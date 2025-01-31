import React, {useEffect, useState} from "react";
import {Menu} from "antd";
import {Link} from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";
import UserProfile from "./UserProfile";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import IntlMessages from "../../util/IntlMessages";
import {useSelector} from "react-redux";
import {sidebarMenuItems} from "../../constants";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const SidebarContent = () => {

  let {navStyle, themeType, pathname} = useSelector(({settings}) => settings);
  const [menuLabelList, setMenuLabelList] = useState([]);

  const getNoHeaderClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  const getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };
  const selectedKeys = pathname.substr(1);
  const defaultOpenKeys = selectedKeys.split('/')[1];

  useEffect(() => {
     const menus = localStorage.getItem('Menus') ? JSON.parse(localStorage.getItem('Menus')) : [];
  //   const menus =  [
  //     {
  //         "menuId": 1,
  //         "menuName": "Inward",
  //         "parentMenuId": 0,
  //         "permission": "View,Add Inward,Export,Edit,Delete",
  //         "displayOrder": 2,
  //         "menuKey": "Inward"
  //     },
  //     {
  //         "menuId": 3,
  //         "menuName": "Partywise Register",
  //         "parentMenuId": 0,
  //         "permission": "Plan,Retrieve,Cancel Finish,Edit Finish,Add Inward,View,Export,Deliver",
  //         "displayOrder": 3,
  //         "menuKey": "Partywise Register"
  //     },
  //     {
  //         "menuId": 4,
  //         "menuName": "Work-In Progress",
  //         "parentMenuId": 0,
  //         "permission": "View,Finish",
  //         "displayOrder": 5,
  //         "menuKey": "Work-In Progress"
  //     },
  //     {
  //         "menuId": 5,
  //         "menuName": "Delivered Items",
  //         "parentMenuId": 0,
  //         "permission": "Delete,Add Customer Invoice and Date,View Delivery Info",
  //         "displayOrder": 4,
  //         "menuKey": "Delivered Items"
  //     },
  //     {
  //         "menuId": 6,
  //         "menuName": "Reports",
  //         "parentMenuId": 0,
  //         "permission": "Generate Report",
  //         "displayOrder": 6,
  //         "menuKey": "Reports"
  //     },
  //     {
  //         "menuId": 7,
  //         "menuName": "Material",
  //         "parentMenuId": 2,
  //         "permission": "Add Material,View,Edit,Delete,Export",
  //         "displayOrder": 1,
  //         "menuKey": "Material"
  //     },
  //     {
  //         "menuId": 8,
  //         "menuName": "Party",
  //         "parentMenuId": 2,
  //         "permission": "Add,View,Edit,Delete,Export",
  //         "displayOrder": 2,
  //         "menuKey": "Party"
  //     },
  //     {
  //         "menuId": 9,
  //         "menuName": "Rates",
  //         "parentMenuId": 2,
  //         "permission": "Export,Delete,View,Add,Edit",
  //         "displayOrder": 3,
  //         "menuKey": "Rates"
  //     },
  //     {
  //         "menuId": 10,
  //         "menuName": "Tags",
  //         "parentMenuId": 2,
  //         "permission": "Process Tags,End User Tags,Add,View,Edit,Delete,Export",
  //         "displayOrder": 4,
  //         "menuKey": "Tags"
  //     },
  //     {
  //         "menuId": 11,
  //         "menuName": "User Access",
  //         "parentMenuId": 0,
  //         "permission": "View,Export,Delete,Edit,Add",
  //         "displayOrder": 5,
  //         "menuKey": "User Access"
  //     },
  //     {
  //         "menuId": 13,
  //         "menuName": "Templates",
  //         "parentMenuId": 12,
  //         "permission": "Add,View,Edit,Delete",
  //         "displayOrder": 1,
  //         "menuKey": "Templates"
  //     },
  //     {
  //         "menuId": 14,
  //         "menuName": "Reports",
  //         "parentMenuId": 12,
  //         "permission": "Add,View,Edit,Delete",
  //         "displayOrder": 2,
  //         "menuKey": "Reports"
  //     },
  //     {
  //         "menuId": 15,
  //         "menuName": "KQP",
  //         "parentMenuId": 12,
  //         "permission": "Delete,Edit,View,Add",
  //         "displayOrder": 3,
  //         "menuKey": "KQP"
  //     },
  //     {
  //         "menuId": 16,
  //         "menuName": "Packing",
  //         "parentMenuId": 2,
  //         "permission": "Delete,Add,View,Edit,Export",
  //         "displayOrder": 5,
  //         "menuKey": "Packing"
  //     },
  //     {
  //         "menuId": 17,
  //         "menuName": "Label Print",
  //         "parentMenuId": 0,
  //         "permission": "Print",
  //         "displayOrder": 6,
  //         "menuKey": "Label Print"
  //     }
  // ] ;
    if(menus.length > 0) {
      const menuLabels = menus.map(menu => menu.menuKey);
      setMenuLabelList(menuLabels);
    }
  }, [])

  return (
    <>
      <SidebarLogo/>
      <div className="gx-sidebar-content">
        <div className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}>
          <UserProfile/>
        </div>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={[defaultOpenKeys]}
            selectedKeys={[selectedKeys]}
            theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
            mode="inline">

            <MenuItemGroup key="main" className="gx-menu-group" title={<IntlMessages id="sidebar.main"/>}>
              <SubMenu key="dashboard" className={getNavStyleSubMenuClass(navStyle)}
                       title={<span> <i className="icon icon-dasbhoard"/>
                         <span><IntlMessages id="sidebar.dashboard"/></span></span>}>
                <Menu.Item key="main/dashboard/sales">
                  <Link to="/main/dashboard/sales">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.dashboard.sales"/></span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/dashboard/stock">
                  <Link to="/main/dashboard/stock">
                    <i className="icon icon-crm"/>
                    <span><IntlMessages id="sidebar.dashboard.stock"/></span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              <MenuItemGroup key="in-built-apps" className="gx-menu-group"
                             title="Company">

                <SubMenu key="company/master" className="gx-menu-group" title={
                      <span> <i className="icon icon-dasbhoard"/>
                        <span><IntlMessages id="sidebar.master"/></span>
                      </span>}
                  >

                  {menuLabelList.includes(sidebarMenuItems.material) && <Menu.Item key="company/master/material">
                    <Link to="/company/master/material">
                      <i className="icon icon-crypto"/>
                      <span><IntlMessages id="sidebar.master.material"/></span>
                    </Link>
                  </Menu.Item>}

                  {menuLabelList.includes(sidebarMenuItems.party) && <Menu.Item key="company/master/party">
                    <Link to="/company/master/party">
                      <i className="icon icon-crypto"/>
                      <span><IntlMessages id="sidebar.master.party"/></span>
                    </Link>
                  </Menu.Item>}

                  {menuLabelList.includes(sidebarMenuItems.party) && <Menu.Item key="company/master/yieldLoss">
                    <Link to="/company/master/yieldLoss">
                      <i className="icon icon-crypto"/>
                      <span><IntlMessages id="sidebar.master.yieldLoss"/></span>
                    </Link>
                  </Menu.Item>}

                  {menuLabelList.includes(sidebarMenuItems.rates) && <Menu.Item key="company/master/rates">
                    <Link to="/company/master/rates">
                      <i className="icon icon-crypto"/>
                      <span><IntlMessages id="sidebar.master.rates"/></span>
                    </Link>
                  </Menu.Item>}

                  {  
                  menuLabelList.includes(sidebarMenuItems.packing) && <Menu.Item key="company/master/packing">
                    <Link to="/company/master/packing">
                      <i className="icon icon-crypto"/>
                      <span><IntlMessages id="sidebar.master.packing"/></span>
                    </Link>
                  </Menu.Item>}

                  {/* <Menu.Item key="company/master/quality">
                    <Link to="/company/master/quality">
                      <i className="icon icon-crypto" />
                      <span><IntlMessages id="sidebar.master.quality" /></span>
                    </Link>
                  </Menu.Item> */}
                    <SubMenu key="quality" className={getNavStyleSubMenuClass(navStyle)} title={
                      <span>
                        <i className="icon icon-all-contacts" />
                        <span><IntlMessages id="sidebar.quality" /></span>
                      </span>}>
                      <Menu.Item key="company.quality.reports">
                        <Link to="/company/quality/reports">
                          <span><IntlMessages id="sidebar.quality.reports" /></span>
                        </Link>
                      </Menu.Item>
                      <Menu.Item key="company.quality.templates">
                        <Link to="/company/quality/templates">
                          <span><IntlMessages id="sidebar.quality.templates" /></span></Link>
                      </Menu.Item>
                      <Menu.Item key="company.quality.kqp">
                        <Link to="/company/quality/kqp">
                          <span><IntlMessages id="sidebar.quality.kqp" /></span></Link>
                      </Menu.Item>
                    </SubMenu>

                  {menuLabelList.includes(sidebarMenuItems.tags) && <Menu.Item key="company/master/tags">
                    <Link to="/company/master/tags">
                      <i className="icon icon-crypto"/>
                      <span><IntlMessages id="sidebar.master.tags"/></span>
                    </Link>
                  </Menu.Item>}
                  
                </SubMenu>
                {menuLabelList.includes(sidebarMenuItems.inward) && <Menu.Item key="company/inward">
                  <Link to="/company/inward">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.company.inward"/></span>
                  </Link>
                </Menu.Item>}
                {menuLabelList.includes(sidebarMenuItems.partywiseRegister) && <Menu.Item key="company/partywise-register">
                  <Link to="/company/partywise-register">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.company.partywiseRegister"/></span>
                  </Link>
                </Menu.Item>}
                {menuLabelList.includes(sidebarMenuItems.labelPrint) && <Menu.Item key="company/labelPrint">
                    <Link to="/company/labelPrint">
                      <i className="icon icon-crypto"/>
                      <span><IntlMessages id="sidebar.company.labelPrint"/></span>
                    </Link>
                  </Menu.Item>} 
                {menuLabelList.includes(sidebarMenuItems.deilveredItems) && <Menu.Item key="company/deliveredItems">
                  <Link to="/company/deliveredItems">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.company.deliveryItems"/></span>
                  </Link>
                </Menu.Item>}
                {menuLabelList.includes(sidebarMenuItems.workInProgress) && <Menu.Item key="main/company/workin-progress">
                  <Link to="/company/workin-progress">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.company.workinprogress"/></span>
                  </Link>
                </Menu.Item>}
                {menuLabelList.includes(sidebarMenuItems.reports) && <Menu.Item key="company/reports">
                  <Link to="/company/reports">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.company.reports"/></span>
                  </Link>
                </Menu.Item>}
                {menuLabelList.includes(sidebarMenuItems.billingInfo) && <Menu.Item key="company/billingInfo">
                  <Link to="/company/billingInfo">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.company.billingInfo"/></span>
                  </Link>
                </Menu.Item>}
                {menuLabelList.includes(sidebarMenuItems.userAccess) && <Menu.Item key="company/userAccess">
                  <Link to="/company/userAccess">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.company.userAccess"/></span>
                  </Link>
                </Menu.Item>}
                {(menuLabelList.includes(sidebarMenuItems.salesOrder) || true) && <Menu.Item key="company/salesOrder">
                  <Link to="/company/sales-order">
                    <i className="icon icon-crypto"/>
                    <span><IntlMessages id="sidebar.company.salesOrder"/></span>
                  </Link>
                </Menu.Item>}
              </MenuItemGroup>
            </MenuItemGroup>
          </Menu>
        </CustomScrollbars>
      </div>
    </>
  );
};

SidebarContent.propTypes = {};
export default SidebarContent;

