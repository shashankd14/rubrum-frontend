import React, { useEffect } from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const QualityTemplate = ({ match }) => {
    return (
        <Switch>
            <Route exact path={`${match.url}/`} component={asyncComponent(() => import('./Templates'))} />
            <Route path={`${match.url}/create`} component={asyncComponent(() => import('./create'))} />
            <Route path={`${match.url}/view/:id`} component={asyncComponent(() => import('./create'))} />
            <Route path={`${match.url}/edit/:id`} component={asyncComponent(() => import('./create'))} />
            <Route path={`${match.url}/link`} component={asyncComponent(() => import('./linked'))} />
            {/* <Route path={`${match.url}/link/edit/:id`} component={asyncComponent(() => import('./linked'))} />
            <Route path={`${match.url}/link/view/:id`} component={asyncComponent(() => import('./linked'))} /> */}
        </Switch>
    )
};

export default QualityTemplate;