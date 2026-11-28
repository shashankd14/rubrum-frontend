import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const List = asyncComponent(() => import("./Templates"));
const CreateTemplate = asyncComponent(() => import("./create"));
const Link = asyncComponent(() => import("./linked"));

const QualityTemplate = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/`}
        component={List}
      />
      <Route
        path={`${match.url}/create`}
        component={CreateTemplate}
      />
      <Route
        path={`${match.url}/view/:id`}
        component={CreateTemplate}
      />
      <Route
        path={`${match.url}/edit/:id`}
        component={CreateTemplate}
      />
      <Route
        path={`${match.url}/link`}
        component={Link}
      />
      {/* <Route path={`${match.url}/link/edit/:id`} component={asyncComponent(() => import('./linked'))} />
            <Route path={`${match.url}/link/view/:id`} component={asyncComponent(() => import('./linked'))} /> */}
    </Switch>
  );
};

export default QualityTemplate;
