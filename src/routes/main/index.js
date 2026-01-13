import React from "react";
import {Route, Switch} from "react-router-dom";
import Dashboard from "./dashboard";
import Layouts from "./Layouts";

const Main = ({match}) => (
  <Switch>
    <Route path={`${match.url}/dashboard`} component={Dashboard}/>
    <Route path={`${match.url}/layouts`} component={Layouts}/>
  </Switch>
);

export default Main;
