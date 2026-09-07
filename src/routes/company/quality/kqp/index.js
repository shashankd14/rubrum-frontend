import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const TemplatesAsync = asyncComponent(() => import('./Templates'));
const CreateAsync = asyncComponent(() => import('./create'));
const LinkedAsync = asyncComponent(() => import('./linked'));

const QualityTemplate = ({ match }) => {

    return (
        <Switch>
            <Route exact path={`${match.url}/`} component={TemplatesAsync} />
            <Route path={`${match.url}/create`} component={CreateAsync} />
            <Route path={`${match.url}/view/:id`} component={CreateAsync} />
            <Route path={`${match.url}/edit/:id`} component={CreateAsync} />
            <Route path={`${match.url}/link`} component={LinkedAsync} />
        </Switch>
    )
};

export default QualityTemplate;