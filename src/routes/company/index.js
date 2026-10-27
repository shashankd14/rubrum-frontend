import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const MasterAsync = asyncComponent(() => import("./Master"));
const InwardAsync = asyncComponent(() => import("./Inward"));
const PartywiseAsync = asyncComponent(() => import("./Partywise"));
const PurchaseInvoicesAsync = asyncComponent(() => import("./PurchaseInvoices"));
const WorkinProgressAsync = asyncComponent(() => import("./WorkinProgress"));
const LabelPrintAsync = asyncComponent(() => import("./LabelPrint"));
const DeliveryAsync = asyncComponent(() => import("./Delivery"));
const ReportsAsync = asyncComponent(() => import("./Reports"));
const BillingInfoAsync = asyncComponent(() => import("./Delivery/BillingInfo"));
const QualityAsync = asyncComponent(() => import("./quality"));
const UserAccessAsync = asyncComponent(() => import("./UserAccess"));
const SalesOrderAsync = asyncComponent(() => import("./SalesOrder"));
const SalesOrderModuleAsync = asyncComponent(() => import("./SalesOrderModule"));
const ConsolidatedPlansAsync = asyncComponent(() => import("./ConsolidatedPlans"));
const AllocatedCoilsAsync = asyncComponent(() => import("./AllocatedCoils"));

const Company = ({ match }) => (
  <Switch>
    <Route
      path={`${match.url}/master`}
      component={MasterAsync}
    />
    <Route
      path={`${match.url}/inward`}
      component={InwardAsync}
    />
    <Route
      path={`${match.url}/locationwise-register`}
      component={PartywiseAsync}
    />
    <Route
      path={`${match.url}/purchase-invoices`}
      component={PurchaseInvoicesAsync}
    />
    <Route
      path={`${match.url}/workin-progress`}
      component={WorkinProgressAsync}
    />
    <Route
      path={`${match.url}/labelPrint`}
      component={LabelPrintAsync}
    />
    <Route
      path={`${match.url}/deliveredItems`}
      component={DeliveryAsync}
    />
    <Route
      path={`${match.url}/reports`}
      component={ReportsAsync}
    />
    <Route
      path={`${match.url}/billingInfo`}
      component={BillingInfoAsync}
    />
    <Route
      path={`${match.url}/quality`}
      component={QualityAsync}
    />
    <Route
      path={`${match.url}/userAccess`}
      component={UserAccessAsync}
    />
    <Route
      path={`${match.url}/sales-order`}
      component={SalesOrderAsync}
    />
    <Route
      path={`${match.url}/sales-orderModule`}
      component={SalesOrderModuleAsync}
    />
    <Route
      path={`${match.url}/sales-orderModule`}
      component={SalesOrderModuleAsync}
    />
    <Route
      path={`${match.url}/consolidated-plans`}
      component={ConsolidatedPlansAsync}
    />
    <Route
      path={`${match.url}/allocated-coils`}
      component={AllocatedCoilsAsync}
    />
  </Switch>
);

export default Company;
