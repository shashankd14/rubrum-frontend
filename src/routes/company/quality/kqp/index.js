import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const template = asyncComponent(() => import('./Templates'));
const create = asyncComponent(() => import('./create'));
const linked = asyncComponent(() => import('./linked'));

const QualityTemplate = ({ match }) => {

    return (
        <Switch>
            <Route exact path={`${match.url}/`} component={template} />
            <Route path={`${match.url}/create`} component={create} />
            <Route path={`${match.url}/view/:id`} component={create} />
            <Route path={`${match.url}/edit/:id`} component={create} />
            <Route path={`${match.url}/link`} component={linked} />
        </Switch>
    )
};

export default QualityTemplate;