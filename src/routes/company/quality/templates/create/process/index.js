import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const ProcessForm = asyncComponent(() => import("./ProcessForm"));
const QualityTemplateProcessCreate = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}`}
        component={ProcessForm}
      />
    </Switch>
  );
};

export default QualityTemplateProcessCreate;
