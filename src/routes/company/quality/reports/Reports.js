import React, { useEffect, useState } from "react";
import { Card, Tabs } from 'antd'
import { useIntl } from "react-intl";
import IntlMessages from '../../../../util/IntlMessages'
import { QUALITY_REPORT_ACTIONS } from "../../../../constants/quality/ComponentConstants";
import InwardReport from "./InwardReport";

const Reports = () => {
  const [mode, setMode] = useState("top");
  const [tabKey, setTabKey] = useState("1");
  const intl = useIntl();
  const TabPane = Tabs.TabPane;

  const onTabChange = (key) => {
    setTabKey(key);
  };

  return (
    <div>
      <h1>
        <IntlMessages id="sidebar.quality.reports" />
      </h1>
      <Card>
        <Tabs defaultActiveKey="1" tabPosition={mode} onChange={onTabChange} destroyInactiveTabPane={true} >
          <TabPane tab="Inward" key="1">
            <InwardReport/>
          </TabPane>
          <TabPane tab="Pre-Processing" key="2" className="additionalTab">
            {/* <List actions={QUALITY_REPORT_ACTIONS} /> */}
          </TabPane>
          <TabPane tab="Processing" key="3" className="additionalTab">
            {/* <List actions={QUALITY_REPORT_ACTIONS} /> */}
          </TabPane>
          <TabPane tab="Pre-Dispatch" key="4" className="additionalTab">
            {/* <List actions={QUALITY_REPORT_ACTIONS} /> */}
          </TabPane>
          <TabPane tab="Post-Dispatch" key="5" className="additionalTab">
            {/* <List actions={QUALITY_REPORT_ACTIONS} /> */}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}

export default Reports