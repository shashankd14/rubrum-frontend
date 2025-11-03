import React, {useEffect, useState} from "react";
import {Menu} from "antd";
import {Link} from "react-router-dom";
import { Icon } from "antd";

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

const getSelectedKey = (path) => {
  const parts = path.split("/").filter(Boolean); // ['company','master','material','edit','123']
  // For 3-level sections like /company/master/<leaf> and /company/quality/<leaf>
  if (
    parts[0] === "company" &&
    (parts[1] === "master" || parts[1] === "quality") &&
    parts[2]
  ) {
    return `/${parts.slice(0, 3).join("/")}`; // /company/master/material
  }
  // Default: first 2 segments (e.g., /company/inward)
  return `/${parts.slice(0, Math.min(parts.length, 2)).join("/")}`;
};

// keep the parent submenu open
const getOpenKeys = (path) => {
  const parts = path.split("/").filter(Boolean);
  if (parts.length >= 2) {
    return [`/${parts.slice(0, 2).join("/")}`]; // /company/master or /company/inward
  }
  return [];
};

  // Pick the longest segment that matches a menu item key
const selectedKeys = getSelectedKey(pathname);
const [openKeys, setOpenKeys] = useState(getOpenKeys(pathname));
useEffect(() => setOpenKeys(getOpenKeys(pathname)), [pathname]);

  const defaultOpenKeys = [];

  useEffect(() => {
    const menus = localStorage.getItem('Menus') ? JSON.parse(localStorage.getItem('Menus')) : [];

    if(menus.length > 0) {
      const menuLabels = menus.map(menu => menu.menuKey);
      setMenuLabelList(menuLabels);
    }
  }, [])
  
  return (
    <>
      <SidebarLogo />
      <div className="gx-sidebar-content">
        <div
          className={`gx-sidebar-notifications ${getNoHeaderClass(navStyle)}`}
        >
          <UserProfile />
        </div>
        <CustomScrollbars className="gx-layout-sider-scrollbar">
          <Menu
            defaultOpenKeys={defaultOpenKeys}
            selectedKeys={selectedKeys}
            theme={themeType === THEME_TYPE_LITE ? "lite" : "dark"}
            mode="inline"
          >
            <MenuItemGroup
              key="main"
              className="gx-menu-group"
              title={<IntlMessages id="sidebar.main" />}
            >
              <SubMenu
                key="dashboard"
                className={getNavStyleSubMenuClass(navStyle)}
                title={
                  <span>
                    {" "}
                    <i className="icon icon-dasbhoard" />
                    <span>
                      <IntlMessages id="sidebar.dashboard" />
                    </span>
                  </span>
                }
              >
                <Menu.Item key="main/dashboard/sales">
                  <Link to="/main/dashboard/sales">
                    <i className="icon icon-crypto" />
                    <span>
                      <IntlMessages id="sidebar.dashboard.sales" />
                    </span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="main/dashboard/stock">
                  <Link to="/main/dashboard/stock">
                    <i className="icon icon-crm" />
                    <span>
                      <IntlMessages id="sidebar.dashboard.stock" />
                    </span>
                  </Link>
                </Menu.Item>
              </SubMenu>
              <MenuItemGroup
                key="in-built-apps"
                className="gx-menu-group"
                title="Company"
              >
                <SubMenu
                  key="company/master"
                  className="gx-menu-group"
                  title={
                    <span>
                      {" "}
                      <i className="icon icon-company" />
                      <span>
                        <IntlMessages id="sidebar.master" />
                      </span>
                    </span>
                  }
                >
                  {menuLabelList.includes(sidebarMenuItems.material) && (
                    <Menu.Item key="/company/master/material">
                      <Link to="/company/master/material">
                        <i
                          className="icon icon-diamond"
                          style={{ "min-width": "14px" }}
                        />
                        <span>
                          <IntlMessages id="sidebar.master.material" />
                        </span>
                      </Link>
                    </Menu.Item>
                  )}

                  {menuLabelList.includes(sidebarMenuItems.party) && (
                    <Menu.Item key="/company/master/party">
                      <Link to="/company/master/party">
                        <i className="icon icon-location" />
                        <span>
                          <IntlMessages id="sidebar.master.party" />
                        </span>
                      </Link>
                    </Menu.Item>
                  )}

                  {menuLabelList.includes(sidebarMenuItems.party) && (
                    <Menu.Item key="/company/master/yieldLoss">
                      <Link to="/company/master/yieldLoss">
                        <i className="icon icon-default-timeline" />
                        <span>
                          <IntlMessages id="sidebar.master.yieldLoss" />
                        </span>
                      </Link>
                    </Menu.Item>
                  )}

                  {menuLabelList.includes(sidebarMenuItems.rates) && (
                    <Menu.Item key="/company/master/rates">
                      <Link to="/company/master/rates">
                        <Icon type="dollar" />
                        <span>
                          <IntlMessages id="sidebar.master.rates" />
                        </span>
                      </Link>
                    </Menu.Item>
                  )}

                  {menuLabelList.includes(sidebarMenuItems.packing) && (
                    <Menu.Item key="/company/master/packing">
                      <Link to="/company/master/packing">
                        <Icon type="gift" />
                        <span>
                          <IntlMessages id="sidebar.master.packing" />
                        </span>
                      </Link>
                    </Menu.Item>
                  )}

                  {/* <Menu.Item key="company/master/quality">
                    <Link to="/company/master/quality">
                      <i className="icon icon-crypto" />
                      <span><IntlMessages id="sidebar.master.quality" /></span>
                    </Link>
                  </Menu.Item> */}
                  <SubMenu
                    key="quality"
                    className={getNavStyleSubMenuClass(navStyle)}
                    title={
                      <span>
                        <i className="icon icon-all-contacts" />
                        <span>
                          <IntlMessages id="sidebar.quality" />
                        </span>
                      </span>
                    }
                  >
                    <Menu.Item key="/company/quality/reports">
                      <Link to="/company/quality/reports">
                        <span>
                          <IntlMessages id="sidebar.quality.reports" />
                        </span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/company/quality/templates">
                      <Link to="/company/quality/templates">
                        <span>
                          <IntlMessages id="sidebar.quality.templates" />
                        </span>
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="/company/quality/kqp">
                      <Link to="/company/quality/kqp">
                        <span>
                          <IntlMessages id="sidebar.quality.kqp" />
                        </span>
                      </Link>
                    </Menu.Item>
                  </SubMenu>

                  {menuLabelList.includes(sidebarMenuItems.tags) && (
                    <Menu.Item key="/company/master/tags">
                      <Link to="/company/master/tags">
                        <i className="icon icon-tag-o" />
                        <span>
                          <IntlMessages id="sidebar.master.tags" />
                        </span>
                      </Link>
                    </Menu.Item>
                  )}
                </SubMenu>
                {menuLabelList.includes(sidebarMenuItems.inward) && (
                  <Menu.Item key="/company/inward">
                    <Link to="/company/inward">
                      <i className="icon icon-apps-new" />
                      <span>
                        <IntlMessages id="sidebar.company.inward" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {menuLabelList.includes(sidebarMenuItems.partywiseRegister) && (
                  <Menu.Item key="/company/locationwise-register">
                    <Link to="/company/locationwise-register">
                      <i className="icon icon-location" />
                      <span>
                        <IntlMessages id="sidebar.company.partywiseRegister" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {true && (
                  <Menu.Item key="/company/purchase-invoices">
                    <Link to="/company/purchase-invoices">
                      <i className="icon icon-product-list" />
                      <span>
                        <IntlMessages id="sidebar.company.purchaseInvoices" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {menuLabelList.includes(sidebarMenuItems.labelPrint) && (
                  <Menu.Item key="/company/labelPrint">
                    <Link to="/company/labelPrint">
                      <i className="icon icon-editor" />
                      <span>
                        <IntlMessages id="sidebar.company.labelPrint" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {menuLabelList.includes(sidebarMenuItems.deilveredItems) && (
                  <Menu.Item key="/company/deliveredItems">
                    <Link to="/company/deliveredItems">
                      <i className="icon icon-tasks" />
                      <span>
                        <IntlMessages id="sidebar.company.deliveryItems" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {menuLabelList.includes(sidebarMenuItems.workInProgress) && (
                  <Menu.Item key="/company/workin-progress">
                    <Link to="/company/workin-progress">
                      <i className="icon icon-progress" />
                      <span>
                        <IntlMessages id="sidebar.company.workinprogress" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {menuLabelList.includes(sidebarMenuItems.reports) && (
                  <Menu.Item key="/company/reports">
                    <Link to="/company/reports">
                      <i className="icon icon-stats" />
                      <span>
                        <IntlMessages id="sidebar.company.reports" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {menuLabelList.includes(sidebarMenuItems.billingInfo) && (
                  <Menu.Item key="/company/billingInfo">
                    <Link to="/company/billingInfo">
                      <i className="icon icon-crypto" />
                      <span>
                        <IntlMessages id="sidebar.company.billingInfo" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {menuLabelList.includes(sidebarMenuItems.userAccess) && (
                  <Menu.Item key="/company/userAccess">
                    <Link to="/company/userAccess">
                      <i className="icon icon-user" />
                      <span>
                        <IntlMessages id="sidebar.company.userAccess" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {(menuLabelList.includes(sidebarMenuItems.salesOrder) ||
                  true) && (
                  <Menu.Item key="/company/sales-order">
                    <Link to="/company/sales-order">
                      <i className="icon icon-orders" />
                      <span>
                        <IntlMessages id="sidebar.company.salesOrder" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
                {true && (
                  <Menu.Item key="company/salesOrderModule">
                    <Link to="/company/sales-orderModule">
                      <i className="icon icon-crypto" />
                      <span>
                        <IntlMessages id="sidebar.company.salesOrder" />
                      </span>
                    </Link>
                  </Menu.Item>
                )}
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

