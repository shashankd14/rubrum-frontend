import React from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";
import Plan from "../Partywise/Plan";

const WorkInProgress = ({match}) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`}/>
        <Route path={`${match.url}/list`} component={asyncComponent(() => import('./List'))}/>
        <Route path={`${match.url}/plan/:coilNumber`} component={props => <Plan {...props} wip={true}/>} />
        
    </Switch>
);

export default WorkInProgress;
