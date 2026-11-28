import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const CreateTemplate = asyncComponent(() => import("./CreateTemplate"));
const QualityTemplateCreate = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}`}
        component={CreateTemplate}
      />
    </Switch>
  );
};

export default QualityTemplateCreate;
