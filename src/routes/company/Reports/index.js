import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import Reports from "./Reports";

const WorkInProgress = ({match}) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/reports`}/>
        <Route path={`${match.url}/reports`} component={props => <Reports {...props} />} />
    </Switch>
);

export default WorkInProgress;
