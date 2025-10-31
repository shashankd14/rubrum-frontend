import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Card, Tabs } from "antd";
import { useIntl } from "react-intl";
import { useLocation } from "react-router-dom";
import IntlMessages from "../../../../util/IntlMessages";
import InwardReport from "./InwardReport";
import { deleteQualityTemplate } from "../../../../appRedux/actions";
import PreProcessingReport from "./PreProcessingReport";
import ProcessingReport from "./ProcessingReport";
import PreDispatchReport from "./PreDispatchReport";
import PostDispatchReport from "./PostDispatchReport";

const QualityReports = (props) => {
  const [mode, setMode] = useState("top");
  const [tabKey, setTabKey] = useState("1");
  const intl = useIntl();
  const TabPane = Tabs.TabPane;
  const location = useLocation();

  useEffect(() => {
    if (props.match) {
      const params = new URLSearchParams(location.search);
      if (params.get("view") === "links") {
        setTabKey("2");
      } else {
        setTabKey("1");
      }
    }
  }, []);

  const onTabChange = (key) => {
    setTabKey(key);
  };

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.quality.reports" />
      </h1>
      <Card>
        <Tabs
          defaultActiveKey="1"
          tabPosition={mode}
          onChange={onTabChange}
          destroyInactiveTabPane={true}
        >
          <TabPane tab="Inward" key="1">
            <InwardReport />
          </TabPane>
          <TabPane tab="Pre-Processing" key="2" className="additionalTab">
            <PreProcessingReport />
          </TabPane>
          <TabPane tab="Processing" key="3" className="additionalTab">
            <ProcessingReport />
          </TabPane>
          <TabPane tab="Pre-Dispatch" key="4" className="additionalTab">
            <PreDispatchReport />
          </TabPane>
          <TabPane tab="Post-Dispatch" key="5" className="additionalTab">
            <PostDispatchReport />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

const mapStateToProps = (state) => ({
  templateDetails: state.quality,
});

export default connect(mapStateToProps, {
  deleteQualityTemplate,
})(QualityReports);
