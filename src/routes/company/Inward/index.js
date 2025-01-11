import React from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";
import Create from "./Create";

const Inward = ({match}) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`}/>
        <Route path={`${match.url}/list`} component={asyncComponent(() => import('./List'))}/>
        <Route path={`${match.url}/create/:inwardEntryId?`} component={asyncComponent(() => import('./Create'))}/>
        <Route path={`${match.url}/:coilNumber`} component={asyncComponent(() => import('./View'))}/>
        
    </Switch>
);

export default Inward;
