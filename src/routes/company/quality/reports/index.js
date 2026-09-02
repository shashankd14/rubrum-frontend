import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const QualityReport = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}`}
        component={asyncComponent(() => import("./QualityReports"))}
      />
      <Route
        exact
        path={`${match.url}/create/:stage`}
        component={asyncComponent(() => import("./create"))}
      />
      <Route
        path={`${match.url}/view/:id`}
        component={asyncComponent(() => import("./create"))}
      />
      <Route
        path={`${match.url}/edit/:id`}
        component={asyncComponent(() => import("./create"))}
      />
    </Switch>
  );
};

export default QualityReport;
