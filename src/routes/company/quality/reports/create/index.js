import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch} from "react-router-dom";

const QualityTemplateCreate = ({match}) => {
    return (
    <Switch>
        <Route exact path={`${match.url}`} component={asyncComponent(() => import('./CreateReport'))}/>
    </Switch>
)};

export default QualityTemplateCreate;