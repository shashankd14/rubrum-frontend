import React from "react";
import {Route, Switch} from "react-router-dom";

import Main from "./main/index";
import Company from "./company/index";

const App = ({match}) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <Route path={`${match.url}main`} component={Main}/>
      <Route path={`${match.url}company`} component={Company}/>
    </Switch>
  </div>
);

export default App;
