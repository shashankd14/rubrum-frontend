import React from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";

const Quality = ({match}) => (
    <Switch>
        <Route path={`${match.url}/reports`} component={asyncComponent(() => import('./reports'))}/>
        <Route path={`${match.url}/templates`} component={asyncComponent(() => import('./templates'))}/>
        <Route path={`${match.url}/kqp`} component={asyncComponent(() => import('./kqp'))}/>
    </Switch>
);

export default Quality;