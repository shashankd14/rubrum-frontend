import React from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const CreateLinkTemplate = asyncComponent(() => import("./CreateLinkTemplate"));

const QualityLinkTemplateCreate = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/:id`}
        component={CreateLinkTemplate}
      />
      <Route
        path={`${match.url}/edit/:id`}
        component={CreateLinkTemplate}
      />
      <Route
        path={`${match.url}/view/:id`}
        component={CreateLinkTemplate}
      />
    </Switch>
  );
};

export default QualityLinkTemplateCreate;
