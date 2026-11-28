import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const CreateTemplate = asyncComponent(() => import("./CreateTemplate"));
const ProcessForm = asyncComponent(() => import("./process/ProcessForm"));
const QualityTemplateCreate = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}`}
        component={CreateTemplate}
      />
      <Route
        path={`${match.url}/process/:processType`}
        component={ProcessForm}
      />
    </Switch>
  );
};

export default QualityTemplateCreate;
