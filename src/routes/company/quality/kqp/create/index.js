import React, { useEffect } from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";

const QualityTemplateCreate = ({match}) => {

    return (
    <Switch>
        <Route exact path={`${match.url}`} component={asyncComponent(() => import('./CreateTemplate'))}/>
    </Switch>
)};

export default QualityTemplateCreate;