import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const Company = ({match}) => (
    <Switch>
        <Route path={`${match.url}/master`} component={asyncComponent(() => import('./Master'))}/>
        <Route path={`${match.url}/inward`} component={asyncComponent(() => import('./Inward'))}/>
        <Route path={`${match.url}/locationwise-register`} component={asyncComponent(() => import('./Partywise'))}/>
        <Route path={`${match.url}/workin-progress`} component={asyncComponent(() => import('./WorkinProgress'))}/>
        <Route path={`${match.url}/labelPrint`} component={asyncComponent(() => import('./LabelPrint'))}/>
        <Route path={`${match.url}/deliveredItems`} component={asyncComponent(() => import('./Delivery'))}/>
        <Route path={`${match.url}/reports`} component={asyncComponent(() => import('./Reports'))}/>
        <Route path={`${match.url}/billingInfo`} component={asyncComponent(() => import('./Delivery/BillingInfo'))}/>
        <Route path={`${match.url}/quality`} component={asyncComponent(() => import('./quality'))}/>
        <Route path={`${match.url}/userAccess`} component={asyncComponent(() => import('./UserAccess'))}/>
        <Route path={`${match.url}/sales-order`} component={asyncComponent(() => import('./SalesOrder'))}/>
        {/* <Route path={`${match.url}/sales-orderModule`} component={asyncComponent(() => import('./SalesOrderModule'))}/> */}
    </Switch>
);

export default Company;
