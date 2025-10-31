import React, { useEffect } from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const QualityLinkTemplateCreate = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/:id`}
        component={asyncComponent(() => import("./CreateLinkTemplate"))}
      />
      <Route
        path={`${match.url}/edit/:id`}
        component={asyncComponent(() => import("./CreateLinkTemplate"))}
      />
      <Route
        path={`${match.url}/view/:id`}
        component={asyncComponent(() => import("./CreateLinkTemplate"))}
      />
    </Switch>
  );
};

export default QualityLinkTemplateCreate;
