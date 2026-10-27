import React, { useEffect } from "react";
import asyncComponent from "util/asyncComponent";
import { Route, Switch } from "react-router-dom";

const CreateLinkTemplateAsync = asyncComponent(() =>
  import("./CreateLinkTemplate")
);

const QualityLinkTemplateCreate = ({ match }) => {
  return (
    <Switch>
      <Route
        exact
        path={`${match.url}/:id`}
        component={CreateLinkTemplateAsync}
      />
      <Route
        path={`${match.url}/edit/:id`}
        component={CreateLinkTemplateAsync}
      />
      <Route
        path={`${match.url}/view/:id`}
        component={CreateLinkTemplateAsync}
      />
    </Switch>
  );
};

export default QualityLinkTemplateCreate;
