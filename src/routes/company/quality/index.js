import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch} from "react-router-dom";

//const List = asyncComponent(() => import('./List'));

const Reports = asyncComponent(() => import('./reports'));
const Templates = asyncComponent(() => import('./templates'));
 const KQP = asyncComponent(() => import('./kqp'));

const Quality = ({match}) => (
    <Switch>
        <Route path={`${match.url}/reports`} component={Reports} />
        <Route path={`${match.url}/templates`} component={Templates} />
        <Route path={`${match.url}/kqp`} component={KQP} />
    </Switch>
);

export default Quality;