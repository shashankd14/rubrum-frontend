import React from "react";
import asyncComponent from "util/asyncComponent";
import { Redirect, Route, Switch } from "react-router-dom";

const List = asyncComponent(() => import('./List'));
const DeliveryDetails = asyncComponent(() => import('./DeliveryDetails'));
const BillingInfo = asyncComponent(() => import('./BillingInfo'));

const Delivery = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
        <Route path={`${match.url}/list`} component={List} />
        <Route path={`${match.url}/delivery/:deliveryId`} component={DeliveryDetails} />
        <Route path={`${match.url}/delivery/billingInfo`} component={BillingInfo} />
    </Switch>
);

export default Delivery;