import React, { Component } from "react";
import Nprogress from "nprogress";
import ReactPlaceholder from "react-placeholder";
import "nprogress/nprogress.css";

import "react-placeholder/lib/reactPlaceholder.css";
import CircularProgress from "components/CircularProgress";

export default function asyncComponent(importComponent) {
  class AsyncFunc extends Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null
      };
    }

    componentWillMount() {
      Nprogress.start();
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    async componentDidMount() {
      this.mounted = true;
      const { default: Component } = await importComponent();
      Nprogress.done();
      if (this.mounted) {
        this.setState({ component: Component });
      }
    }
    render() {
      const Component = this.state.component;
      const { match } = this.props;

      return (
        <ReactPlaceholder type="text" rows={7} ready={true}>
          {Component
            ? <Component key={match && match.url} {...this.props} />
            : <CircularProgress />}
        </ReactPlaceholder>
      );
    }
  }

  return AsyncFunc;
}
