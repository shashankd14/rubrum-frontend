import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const QualityReports = asyncComponent(() => import("./QualityReports"));
const CreateQualityReport = asyncComponent(() => import("./create"));
const QualityReport = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}`}
        component={QualityReports}
      />
      <Route
        exact
        path={`${match.url}/create/:stage`}
        component={CreateQualityReport}
      />
      <Route
        path={`${match.url}/view/:id`}
        component={CreateQualityReport}
      />
      <Route
        path={`${match.url}/edit/:id`}
        component={CreateQualityReport}
      />
    </Switch>
  );
};

export default QualityReport;
