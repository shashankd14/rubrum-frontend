import React from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";

const Delivery = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/party`}/>
        <Route path={`${match.url}/material`} component={asyncComponent(() => import('./Material'))}/>
        <Route path={`${match.url}/party`} component={asyncComponent(() => import('./Party'))} />
        <Route path={`${match.url}/rates`} component={asyncComponent(() => import('./Rates'))} />
        <Route exact path={`${match.url}/quality`} component={asyncComponent(() => import('./Quality'))} />
        <Route exact path={`${match.url}/quality/createTemplate`} component={asyncComponent(() => import('./CreateTemplate'))} />
        <Route path={`${match.url}/tags`} component={asyncComponent(() => import('./Tags'))} />
    </Switch>
);

export default Delivery;
