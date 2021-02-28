import React from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";

const WorkInProgress = ({match}) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`}/>
        <Route path={`${match.url}/list`} component={asyncComponent(() => import('./List'))}/>
        <Route path={`${match.url}/plan/:coilNumber`} component={asyncComponent(() => import('../Partywise/Plan'))}/>
    </Switch>
);

export default WorkInProgress;
