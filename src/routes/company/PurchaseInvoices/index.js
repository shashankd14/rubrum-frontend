import React from "react";
import asyncComponent from "util/asyncComponent";
import { Redirect, Route, Switch } from "react-router-dom";

const PurchaseInvoices = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
    <Route
      path={`${match.url}/list`}
      component={asyncComponent(() => import("./List"))}
    />
  </Switch>
);

export default PurchaseInvoices;
