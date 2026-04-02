import React, { useState } from "react";
import { Layout, Popover } from "antd";
import { Link } from "react-router-dom";

import { toggleCollapsedSideNav } from "../../appRedux/actions/Setting";
import UserInfo from "components/UserInfo";
import Auxiliary from "util/Auxiliary";

import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  TAB_SIZE,
} from "../../constants/ThemeSetting";
import { useDispatch, useSelector } from "react-redux";

const { Header } = Layout;

const Topbar = () => {
  const { width, navCollapsed, navStyle } = useSelector(
    ({ settings }) => settings
  );
  const dispatch = useDispatch();

  return (
    <Header>
      {navStyle === NAV_STYLE_DRAWER ||
      ((navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR) &&
        width < TAB_SIZE) ? (
        <div className="gx-linebar gx-mr-3">
          <i
            className="gx-icon-btn icon icon-menu"
            onClick={() => {
              dispatch(toggleCollapsedSideNav(!navCollapsed));
            }}
          />
        </div>
      ) : null}
      <ul className="gx-header-notifications gx-ml-auto">
        {width >= TAB_SIZE ? null : (
          <Auxiliary>
            <li className="gx-notify"></li>

            <li className="gx-msg">
              {/* <Popover overlayClassName="gx-popover-horizantal" placement="bottomRight"
                       content={<MailNotification/>} trigger="click">
                  <span className="gx-pointer gx-status-pos gx-d-block">
                    <i className="icon icon-chat-new"/>
                    <span className="gx-status gx-status-rtl gx-small gx-orange"/>
                  </span>
              </Popover> */}
            </li>
          </Auxiliary>
        )}
        {width >= TAB_SIZE ? null : (
          <Auxiliary>
            <li className="gx-user-nav">
              <UserInfo />
            </li>
          </Auxiliary>
        )}
      </ul>
    </Header>
  );
};

export default Topbar;
