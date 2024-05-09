import React from "react";
import asyncComponent from "util/asyncComponent";
import {Redirect, Route, Switch} from "react-router-dom";

const Delivery = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/party`}/>
        <Route path={`${match.url}/material`} component={asyncComponent(() => import('./Material'))}/>
        <Route path={`${match.url}/party`} component={asyncComponent(() => import('./Party'))} />
        <Route path={`${match.url}/rates`} component={asyncComponent(() => import('./Rates'))} />
        <Route exact path={`${match.url}/quality`} component={asyncComponent(() => import('./Quality'))} />
        <Route exact path={`${match.url}/quality/createTemplate`} component={asyncComponent(() => import('./CreateTemplate'))} />
        <Route path={`${match.url}/tags`} component={asyncComponent(() => import('./Tags'))} />
        <Route path={`${match.url}/packing`} component={asyncComponent(() => import('./Packing'))} />
        <Route path={`${match.url}/materialDV`} component={asyncComponent(() => import('./MaterialDV'))} />
        <Route path={`${match.url}/vendor`} component={asyncComponent(() => import('./Vendor'))} />
        <Route path={`${match.url}/customer`} component={asyncComponent(() => import('./Customer'))} />
        <Route path={`${match.url}/location`} component={asyncComponent(() => import('./Location'))} />
        <Route path={`${match.url}/category`} component={asyncComponent(() => import('./Category'))} />
        <Route path={`${match.url}/weighbridge`} component={asyncComponent(() => import('./Weighbridge'))} />
        <Route path={`${match.url}/manufacturer`} component={asyncComponent(() => import('./Manufacturer'))} />
        <Route path={`${match.url}/itemGrade`} component={asyncComponent(() => import('./ItemGrade'))} />
        <Route path={`${match.url}/document`} component={asyncComponent(() => import('./DocumentType'))} />
    </Switch>
);

export default Delivery;
