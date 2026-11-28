import React from "react";
import asyncComponent from "util/asyncComponent";
import { Redirect, Route, Switch } from "react-router-dom";
import Unfinish from "./Unfinish";

const List = asyncComponent(() => import('./List'));
const Plan = asyncComponent(() => import('./Plan'));
const DeliveryInfo = asyncComponent(() => import('./DeliveryInfo'));

const PartyWise = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
        <Route path={`${match.url}/list`} component={List} />
        <Route path={`${match.url}/plan/:coilNumber`} component={Plan} />
        <Route path={`${match.url}/unfinish/:coilNumber`}
            render={props => <Unfinish key={props.match.url} {...props} unfinish />} />
        <Route path={`${match.url}/editFinish/:coilNumber`}
            render={props => <Unfinish key={props.match.url} {...props} editFinish />} />
        <Route path={`${match.url}/delivery`} component={DeliveryInfo} />
    </Switch>
);

export default PartyWise;