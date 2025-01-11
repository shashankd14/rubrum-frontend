import React, { useEffect } from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";

const QualityTemplateCreate = ({match}) => {
    useEffect(() => {
        console.log(match)
        // console.log(match.path+(match.params?.hasOwnProperty("id") ? "/" + match.params.id : ""))
    }, [])
    return (
    <Switch>
        <Route exact path={`${match.url}`} component={asyncComponent(() => import('./CreateReport'))}/>
    </Switch>
)};

export default QualityTemplateCreate;