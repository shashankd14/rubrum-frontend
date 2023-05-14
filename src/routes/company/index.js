import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const Company = ({match}) => (
    <Switch>
        <Route path={`${match.url}/master`} component={asyncComponent(() => import('./Master'))}/>
        <Route path={`${match.url}/inward`} component={asyncComponent(() => import('./Inward'))}/>
        <Route path={`${match.url}/partywise-register`} component={asyncComponent(() => import('./Partywise'))}/>
        <Route path={`${match.url}/workin-progress`} component={asyncComponent(() => import('./WorkinProgress'))}/>
        <Route path={`${match.url}/deliveredItems`} component={asyncComponent(() => import('./Delivery'))}/>
        <Route path={`${match.url}/reports`} component={asyncComponent(() => import('./Reports'))}/>
        <Route path={`${match.url}/billingInfo`} component={asyncComponent(() => import('./Delivery/BillingInfo'))}/>
        <Route path={`${match.url}/userAccess`} component={asyncComponent(() => import('./UserAccess'))}/>
    </Switch>
);

export default Company;
