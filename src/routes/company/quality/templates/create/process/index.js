import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const QualityTemplateProcessCreate = ({ match }) => {
  return (
    <Switch>
      <Route
        path={`${match.url}`}
        component={asyncComponent(() => import("./ProcessForm"))}
      />
    </Switch>
  );
};

export default QualityTemplateProcessCreate;
