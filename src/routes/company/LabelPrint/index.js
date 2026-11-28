import React from "react";
import asyncComponent from "util/asyncComponent";
import { Redirect, Route, Switch } from "react-router-dom";

const LabelPrintPage = asyncComponent(() => import('./LabelPrint'));

const LabelPrint = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/labelPrint`} />
        <Route path={`${match.url}/labelPrint`} component={LabelPrintPage} />
    </Switch>
);

export default LabelPrint;