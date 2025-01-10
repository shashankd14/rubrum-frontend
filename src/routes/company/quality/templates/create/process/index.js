import React, { useEffect } from 'react';
import asyncComponent from 'util/asyncComponent';
import { Redirect, Route, Switch } from 'react-router-dom';

const QualityTemplateProcessCreate = ({ match }) => {
  useEffect(() => {
    console.log(match);
    // console.log(match.path+(match.params?.hasOwnProperty("id") ? "/" + match.params.id : ""))
  }, []);
  return (
    <Switch>
      <Route
        path={`${match.url}`}
        component={asyncComponent(() => import('./ProcessForm'))}
      />
    </Switch>
  );
};

export default QualityTemplateProcessCreate;
