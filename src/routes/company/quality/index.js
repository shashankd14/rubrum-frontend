import React from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";

const ReportsAsync = asyncComponent(() => import('./reports'));
const TemplatesAsync = asyncComponent(() => import('./templates'));
const KqpAsync = asyncComponent(() => import('./kqp'));

const Quality = ({match}) => (
    <Switch>
        <Route path={`${match.url}/reports`} component={ReportsAsync}/>
        <Route path={`${match.url}/templates`} component={TemplatesAsync}/>
        <Route path={`${match.url}/kqp`} component={KqpAsync}/>
    </Switch>
);

export default Quality;