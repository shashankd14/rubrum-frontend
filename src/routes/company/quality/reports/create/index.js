import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const CreateReport = asyncComponent(() => import("./CreateReport"));
const QualityTemplateCreate = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}`}
        component={CreateReport}
      />
    </Switch>
  );
};

export default QualityTemplateCreate;
