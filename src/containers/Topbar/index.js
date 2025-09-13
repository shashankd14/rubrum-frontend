import React, {useState} from "react";
import {Layout, Popover} from "antd";
import {Link} from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import languageData from "./languageData";
import {switchLanguage, toggleCollapsedSideNav} from "../../appRedux/actions/Setting";
import SearchBox from "components/SearchBox";
import UserInfo from "components/UserInfo";
import AppNotification from "components/AppNotification";
import MailNotification from "components/MailNotification";
import Auxiliary from "util/Auxiliary";


import {NAV_STYLE_DRAWER, NAV_STYLE_FIXED, NAV_STYLE_MINI_SIDEBAR, TAB_SIZE} from "../../constants/ThemeSetting";
import {useDispatch, useSelector} from "react-redux";

const {Header} = Layout;

const Topbar = () => {

  const {locale, width, navCollapsed, navStyle} = useSelector(({settings}) => settings);
  const {searchText, setSearchText} = useState('');
  const dispatch = useDispatch();

  const updateSearchChatUser = (evt) => {
    setSearchText(evt.target.value);
  };
  return (
   <></>
  );
};

export default Topbar;
