import React from "react";
import asyncComponent from "util/asyncComponent";
import { Redirect, Route, Switch } from "react-router-dom";
import Plan from "../Partywise/Plan";

const List = asyncComponent(() => import('./List'));

const WorkInProgress = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
        <Route path={`${match.url}/list`} component={List} />
        <Route path={`${match.url}/plan/:coilNumber`}
            render={props => <Plan key={props.match.url} {...props} wip={true} />} />
    </Switch>
);

export default WorkInProgress;