import React, { useEffect } from "react";
import asyncComponent from "util/asyncComponent";
import { Redirect, Route, Switch } from "react-router-dom";

const QualityReport = ({ match }) => {
    return (
        <Switch>
            {/* <Redirect exact path={`${match.url}`} component={asyncComponent(() => import('./QualityReports'))}/> */}
            <Route exact path={`${match.url}`} component={asyncComponent(() => import('./QualityReports'))} />
            {/* <Route exact path={`${match.url}/create`} component={asyncComponent(() => import('./create'))} /> */}
            <Route exact path={`${match.url}/create/:stage`} component={asyncComponent(() => import('./create'))} />
            <Route path={`${match.url}/view/:id`} component={asyncComponent(() => import('./create'))} />
            <Route path={`${match.url}/edit/:id`} component={asyncComponent(() => import('./create'))} />
        </Switch>
    )
};

export default QualityReport;