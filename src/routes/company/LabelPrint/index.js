import React from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";

const LabelPrint = ({match}) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/labelPrint`}/>
         <Route path={`${match.url}/labelPrint`} component={asyncComponent(() => import('./LabelPrint'))}/> 
    </Switch>
);

export default LabelPrint;
