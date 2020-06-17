import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const Company = ({match}) => (
    <Switch>
        <Route path={`${match.url}/inward`} component={asyncComponent(() => import('./Inward'))}/>
        <Route path={`${match.url}/party-wise`} component={asyncComponent(() => import('./Partywise'))}/>
        <Route path={`${match.url}/workin-progress`} component={asyncComponent(() => import('./WorkinProgress'))}/>
    </Switch>
);

export default Company;
