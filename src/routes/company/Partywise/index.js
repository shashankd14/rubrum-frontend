import React from 'react';
import asyncComponent from 'util/asyncComponent';
import { Redirect, Route, Switch } from 'react-router-dom';
import Unfinish from './Unfinish';

const PartyWise = ({ match }) => (
  <Switch>
    <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
    <Route
      path={`${match.url}/list`}
      component={asyncComponent(() => import('./List'))}
    />
    <Route
      path={`${match.url}/plan/:coilNumber`}
      component={asyncComponent(() => import('./Plan'))}
    />
    <Route
      path={`${match.url}/unfinish/:coilNumber`}
      component={props => <Unfinish {...props} unfinish />}
    />
    <Route
      path={`${match.url}/editFinish/:coilNumber`}
      component={props => <Unfinish {...props} editFinish />}
    />
    <Route
      path={`${match.url}/delivery`}
      component={asyncComponent(() => import('./DeliveryInfo'))}
    />
  </Switch>
);

export default PartyWise;
