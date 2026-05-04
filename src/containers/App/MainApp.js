import React from "react";
import { Layout } from "antd";
import { useDispatch, useSelector } from "react-redux";

import Sidebar from "../Sidebar/index";
import Topbar from "../Topbar/index";
import { footerText } from "util/config";
import App from "routes/index";
import {
  NAV_STYLE_ABOVE_HEADER,
  NAV_STYLE_BELOW_HEADER,
  NAV_STYLE_DARK_HORIZONTAL,
  NAV_STYLE_DEFAULT_HORIZONTAL,
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_INSIDE_HEADER_HORIZONTAL,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
} from "../../constants/ThemeSetting";
import { useRouteMatch } from "react-router-dom";
import { useEffect } from "react";

import { fetchPartyList } from "../../appRedux/actions";

const { Content, Footer } = Layout;
const getContainerClass = (navStyle) => {
  switch (navStyle) {
    case NAV_STYLE_DARK_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_DEFAULT_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_INSIDE_HEADER_HORIZONTAL:
      return "gx-container-wrap";
    case NAV_STYLE_BELOW_HEADER:
      return "gx-container-wrap";
    case NAV_STYLE_ABOVE_HEADER:
      return "gx-container-wrap";
    default:
      return "";
  }
};
const getNavStyles = (navStyle) => {
  switch (navStyle) {
    case NAV_STYLE_FIXED:
      return <Topbar />;
    default:
      return null;
  }
};

const getSidebar = (navStyle, width) => {
  if (width < TAB_SIZE) {
    return <Sidebar />;
  }
  switch (navStyle) {
    case NAV_STYLE_FIXED:
      return <Sidebar />;
    case NAV_STYLE_DRAWER:
      return <Sidebar />;
    case NAV_STYLE_MINI_SIDEBAR:
      return <Sidebar />;
    case NAV_STYLE_NO_HEADER_MINI_SIDEBAR:
      return <Sidebar />;
    case NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR:
      return <Sidebar />;
    default:
      return null;
  }
};

const MainApp = () => {
  const dispatch = useDispatch();
  const { width, navStyle } = useSelector(({ settings }) => settings);
  const match = useRouteMatch();
  const partyList = useSelector((state) => state.party.partyList);

  useEffect(() => {
    if (partyList.length === 0) dispatch(fetchPartyList());
  }, []);

  return (
    <Layout className="gx-app-layout">
      {getSidebar(navStyle, width)}
      <Layout>
        <Content
          className={`gx-layout-content ${getContainerClass(navStyle)} `}
        >
          <App match={match} />
          <Footer>
            <div className="gx-layout-footer-content">{footerText}</div>
          </Footer>
        </Content>
      </Layout>
    </Layout>
  );
};
export default MainApp;
