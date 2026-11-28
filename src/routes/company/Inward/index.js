import React from "react";
import asyncComponent from "util/asyncComponent";
import { Redirect, Route, Switch } from "react-router-dom";

const List = asyncComponent(() => import('./List'));
const Create = asyncComponent(() => import('./Create'));
const View = asyncComponent(() => import('./View'));

const Inward = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
        <Route path={`${match.url}/list`} component={List} />
        <Route path={`${match.url}/create/:inwardEntryId?`} component={Create} />
        <Route path={`${match.url}/:coilNumber`} component={View} />
    </Switch>
);

export default Inward;