import React from "react";
import asyncComponent from "util/asyncComponent";
import { Redirect, Route, Switch } from "react-router-dom";

const Material = asyncComponent(() => import('./Material'));
const Party = asyncComponent(() => import('./Party'));
const YieldLossRatio = asyncComponent(() => import('./YieldLossRatio'));
const Rates = asyncComponent(() => import('./Rates'));
const Quality = asyncComponent(() => import('./Quality'));
const CreateTemplate = asyncComponent(() => import('./CreateTemplate'));
const Tags = asyncComponent(() => import('./Tags'));
const Packing = asyncComponent(() => import('./Packing'));

const Master = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/party`} />
        <Route path={`${match.url}/material`} component={Material} />
        <Route path={`${match.url}/party`} component={Party} />
        <Route path={`${match.url}/yieldLoss`} component={YieldLossRatio} />
        <Route path={`${match.url}/rates`} component={Rates} />
        <Route exact path={`${match.url}/quality`} component={Quality} />
        <Route exact path={`${match.url}/quality/createTemplate`} component={CreateTemplate} />
        <Route path={`${match.url}/tags`} component={Tags} />
        <Route path={`${match.url}/packing`} component={Packing} />
    </Switch>
);

export default Master;