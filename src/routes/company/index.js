import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const Master = asyncComponent(() => import('./Master'));
const Inward = asyncComponent(() => import('./Inward'));
const Partywise = asyncComponent(() => import('./Partywise'));
const WorkinProgress = asyncComponent(() => import('./WorkinProgress'));
const labelPrint = asyncComponent(() => import('./LabelPrint'));
const deliveredItems = asyncComponent(() => import('./Delivery'));
const reports = asyncComponent(() => import('./Reports'));
const billingInfo = asyncComponent(() => import('./Delivery/BillingInfo'));
const quality = asyncComponent(() => import('./quality'));
const userAccess = asyncComponent(() => import('./UserAccess'));

const Company = ({match}) => (
    <Switch>
        <Route path={`${match.url}/master`} component={Master} />
        <Route path={`${match.url}/inward`} component={Inward} />
        <Route path={`${match.url}/partywise-register`} component={Partywise} />
        <Route path={`${match.url}/workin-progress`} component={WorkinProgress} />
        <Route path={`${match.url}/labelPrint`} component={labelPrint} />
        <Route path={`${match.url}/deliveredItems`} component={deliveredItems} />
        <Route path={`${match.url}/reports`} component={reports} />
        <Route path={`${match.url}/billingInfo`} component={billingInfo} />
        <Route path={`${match.url}/quality`} component={quality} />
        <Route path={`${match.url}/userAccess`} component={userAccess} />
    </Switch>
);

export default Company;
